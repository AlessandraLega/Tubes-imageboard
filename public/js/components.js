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
        };
        // return { ok: "ok" };
    },
    mounted: function () {
        var self = this;
        axios
            .get("/modal/" + this.curId)
            .then(function (response) {
                self.curUrl = response.data.url;
                self.curTitle = response.data.title;
                self.curDescription = response.data.description;
            })
            .catch(function (err) {
                console.log("error in openModal: ", err);
            });
    }, //end mounted
    methods: {
        close: function () {
            console.log("close was fired!");
            this.$emit("close");
        },
    },
});
