import "workflowModule.html";
import "workflowModule.scss";

import workflowData from "../data/workflowMain/workflowMain.json";

(function() {
    let vm = new Vue({
        el: "#app",
        data: {
            workflowMain: workflowData,
            thisWorkflowName: "",
            editingWorkflowPath: "",
            workflowData: [
                {
                    "stepName": null,
                    "priority": null,
                    "backgroundColor": "pink",
                    "fontColor": "white"
                }
            ]

        },
        methods: {
            loadworkflowData() {

                this.$http.get(this.editingWorkflowPath).then((response) => {
                    //console.log(response.body[1]);
                    this.workflowData = response.body;
                }, (response) => {
                    console.log("component ajax error");
                });
            }
        },
        created() {
            this.workflowMain.some((e)=>{
                if(e.active === true){
                    this.thisWorkflowName = e.name;
                    this.editingWorkflowPath = e.path
                }
            });
            this.loadworkflowData();
        }
    });
    Vue.config.devtools = true;
})();