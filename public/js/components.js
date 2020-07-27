Vue.component("img-modal", {
    template: "#modal-template",
    props: ["curId"],
    data: function () {
        // console.log("curId", this.curId);
        // return { ok: "ok" };
        return {
            curUrl: "",
            curTitle: "",
            curDescription: "",
            curUsername: "",
            curTime: "",
            lastId: "",
            nextId: "",
            commentUsername: "",
            comment: "",
            allComments: [],
        };
        // return { ok: "ok" };
    },
    mounted: function () {
        var self = this;
        // console.log("mounting the modal");
        axios
            .get("/modal/" + this.curId)
            .then(function (response) {
                self.curUrl = response.data.url;
                self.curTitle = response.data.title;
                self.curDescription = response.data.description;
                self.curUsername = response.data.username;
                self.curTime = response.data.created_at;
                self.nextId = response.data.nextid;
                self.lastId = response.data.lastid;
            })
            .catch(function (err) {
                console.log("error in openModal: ", err);
            });
        axios
            .get("/comments/" + this.curId)
            .then(function (results) {
                // console.log("get comments worked, ", results);
                self.allComments = results.data;
            })
            .catch(function (err) {
                console.log("get comments didn't work, ", err);
            });
    }, //end mounted
    watch: {
        curId: function () {
            // console.log("watch happening");
            var self = this;
            axios
                .get("/modal/" + this.curId)
                .then(function (response) {
                    self.curUrl = response.data.url;
                    self.curTitle = response.data.title;
                    self.curDescription = response.data.description;
                    self.curUsername = response.data.username;
                    self.curTime = response.data.created_at;
                    self.nextId = response.data.nextid;
                    self.lastId = response.data.lastid;
                })
                .catch(function (err) {
                    console.log("error in openModal: ", err);
                });
            axios
                .get("/comments/" + this.curId)
                .then(function (results) {
                    self.allComments = results.data;
                })
                .catch(function (err) {
                    console.log("get comments didn't work, ", err);
                });
        },
    },
    methods: {
        close: function () {
            // console.log("close was fired!");
            this.$emit("close");
        },
        submitComments: function () {
            var self = this;
            axios
                .post("/comment", {
                    curId: this.curId,
                    comment: this.comment,
                    commentUsername: this.commentUsername,
                })
                .then(function (results) {
                    // console.log("results in axios: ", results);
                    self.allComments.unshift(results.data);
                    self.commentUsername = "";
                    self.comment = "";
                })
                .catch(function (err) {
                    console.log("post not working: ", err);
                });
        },
        lastpic: function () {
            console.log("lastpic fired!");
            location.hash = this.lastId;
        },
        nextpic: function () {
            console.log("nextpic fired!");
            location.hash = this.nextId;
        },
        deleteImg: function (deletedId) {
            let self = this;
            axios
                .post("/delete", { id: deletedId })
                .then(function () {
                    location.hash = "";
                    self.$emit("delete", deletedId);
                })
                .catch((err) => {
                    console.log("error in deleteImg :", err);
                });
        },
    },
});
