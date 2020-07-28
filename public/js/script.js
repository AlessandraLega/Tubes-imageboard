(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            curId: location.hash.slice(1),
            more: null,
            lastId: null,
        },
        mounted: function () {
            var self = this;
            // location.hash = "";
            // this.curId = null;
            axios
                .get("/images")
                .then(function (results) {
                    console.log("results.data :", results.data);
                    self.images = results.data;
                    self.checkMore();
                })
                .catch(function (error) {
                    console.log("error in axios: ", error);
                });
            window.addEventListener("hashchange", function () {
                // console.log("hashChange has fired!");
                self.curId = location.hash.slice(1);
            });
        }, //end mounted
        methods: {
            handleClick: function (e) {
                var self = this;
                // console.log("running");
                e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        // console.log("resp in post /upload: ", resp.data);
                        self.images.unshift(resp.data);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        self.file = null;
                    })
                    .catch(function (err) {
                        console.log("error in post /upload: ", err);
                    });
            },
            handleChange: function (e) {
                // console.log("this.file: ", this.file);
                // console.log("e.target.files[0]: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            openModal: function (id) {
                this.curId = id;
            },
            reallyClose: function () {
                this.curId = null;
                location.hash = "";
                // console.log("reallyClosed fired");
            },
            reallyDelete: function (deletedId) {
                let self = this;
                for (let i = 0; i < this.images.length; i++) {
                    if (this.images[i].id == deletedId) {
                        this.images.splice(i, 1);
                    }
                }
                axios.get("/next/" + this.lastId).then(function (response) {
                    self.images.push(response.data);
                });
            },
            checkMore: function () {
                let lastObj = this.images.slice(-1);
                let lastIdOnScreen = lastObj[0].id;
                this.lastId = lastIdOnScreen;
                if (lastIdOnScreen > this.images[0].lowestId) {
                    this.more = true;
                } else {
                    this.more = false;
                }
            },
            showMore: function () {
                let self = this;
                let lastObj = self.images.slice(-1);
                let lastIdOnScreen = lastObj[0].id;
                axios.get("/more/" + lastIdOnScreen).then(function (results) {
                    for (let i = 0; i < results.data.length; i++) {
                        self.images.push(results.data[i]);
                    }
                    self.checkMore();
                });
            },
        },
    });
})();
