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
        },
        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (results) {
                    self.images = results.data;
                    console.log(self.images);
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
                        console.log("resp in post /upload: ", resp.data);
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
                console.log(id);
                this.curId = id;
                console.log(this.curId);
            },
            reallyClose: function () {
                this.curId = null;
                console.log("reallyClosed fired");
            },
        },
    });
})();
