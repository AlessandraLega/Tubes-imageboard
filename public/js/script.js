(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            curId: "",
            more: null,
        },
        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (results) {
                    self.images = results.data;

                    let lastObj = self.images.slice(-1);
                    let lastIdOnScreen = lastObj[0].id;
                    if (lastIdOnScreen > results.data[0].lowestId) {
                        self.more = true;
                    } else {
                        self.more = false;
                    }
                })
                .catch(function (error) {
                    console.log("error in axios: ", error);
                });
        }, //end mounted
        methods: {
            handleClick: function (e) {
                var self = this;
                console.log("running");
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
                    })
                    .catch(function (err) {
                        console.log("error in post /upload: ", err);
                    });
            },
            handleChange: function (e) {
                console.log("this.file: ", this.file);
                console.log("e.target.files[0]: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            openModal: function (id) {
                this.curId = id;
            },
            reallyClose: function () {
                this.curId = null;
                console.log("reallyClosed fired");
            },
            checkMore: function () {
                let lastObj = self.images.slice(-1);
                let lastIdOnScreen = lastObj[0].id;
                if (lastIdOnScreen > results.data[0].lowestId) {
                    self.more = true;
                } else {
                    self.more = false;
                }
            },
            showMore: function () {
                let self = this;
                let lastObj = self.images.slice(-1);
                let lastIdOnScreen = lastObj[0].id;
                axios.get("/more/" + lastIdOnScreen).then(function (results) {
                    console.log("results.data: ", results.data);
                    for (let i = 0; i < results.data.length; i++) {
                        console.log("results.data[i]: ", results.data[i]);
                        self.images.push(results.data[i]);
                    }
                    let lastObj = self.images.slice(-1);
                    let lastIdOnScreen = lastObj[0].id;
                    if (lastIdOnScreen > results.data[0].lowestId) {
                        self.more = true;
                    } else {
                        self.more = false;
                    }
                });
            },
        },
    });
})();
