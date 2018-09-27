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
                    "stepName": "null",
                    "priority": null,
                    "backgroundColor": "pink",
                    "fontColor": "white"
                }
            ],
            "defaulePrioritySelect": [
                { value: null, text: 'Please select an option' },
                { value: 'init', text: 'Initial' },
                { value: 'round', text: 'Ordinary' },
                { value: 'cube', text: 'Priority' },
                { value: 'diamond', text: 'Urgent' }
            ],
            "isEditStep": false,
            "isEditStepNowIndex": 0,
            "firstLoad": true

        },
        methods: {
            loadworkflowData() {

                this.$http.get(this.editingWorkflowPath).then((response) => {
                    //console.log(response.body[1]);
                    this.workflowData = response.body;
                }, (response) => {
                    console.log("component ajax error");
                });
            },
            selectWorkflow(workflow){
                //console.log("select workflow click:",workflow);
                this.editingWorkflowPath = workflow.path;
                this.workflowMain.some((e)=>{
                    e.active = false;
                })
                workflow.active = true;
                this.loadworkflowData();
            },
            openStepValue(index){
                
                if (!this.isEditStep){
                    //this.isEditStep = !this.isEditStep;
                    this.isEditStep = true;
                    this.isEditStepNowIndex = index;
                }
            },
            closeStepValue(){
                this.isEditStep = false;
                this.isEditStepNowIndex = 0;
            },
            addStep(){
                console.log("addStep");
                let copyObj = this.workflowData[this.isEditStepNowIndex];
                this.workflowData.splice(this.isEditStepNowIndex, 0, copyObj);
                //var copyObj = this.workflowData.slice(this.isEditStepNowIndex,1);
                //console.log(copyObj);
                //this.workflowData = insert(this.workflowData, this.isEditStepNowIndex+1, copyObj);
                
                /*setTimeout(() => {
                    this.isEditStep = false;
                    this.isEditStepNowIndex = 0;
                }, 1000)*/

            },
            deleteStep(){
                console.log("deleteStep");
                if (this.workflowData.length>1){
                    this.isEditStep = false;
                    this.workflowData.splice(this.isEditStepNowIndex, 1);
                    setTimeout(() => {
                        this.isEditStepNowIndex = 0;
                        this.isEditStep = false;
                    }, 1000)
                }else{
                    alert("Workflow step 最小數量為1.")
                }
                
                
            },

            beforeEnter(el) {
                let opacityN;
                if (this.firstLoad) {
                    opacityN = 0;
                } else {
                    opacityN = 1;
                }
                el.style.opacity = opacityN;
            },
            enter(el, done) {
                let timer;
                if (this.firstLoad){
                    timer = 150;
                }else{
                    timer = 0;
                }
                let delay = el.dataset.index * timer;
                setTimeout(()=> {
                    Velocity(
                        el,
                        { opacity: 1 },
                        { complete: done }
                    )
                }, delay);
            }, 
            afterEnter(el){
                this.firstLoad = false;
            }
            // leave: function (el, done) {
            //     console.log("el: ",el)
            //     Velocity(
            //         el,{ opacity: 0},{ complete: done }
            //     )
            // }
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