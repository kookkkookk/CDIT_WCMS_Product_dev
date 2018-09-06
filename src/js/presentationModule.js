import layoutsData from "../data/layoutData/xxLayout.json";

(function() {

    let enComponentPartCombination = {
        template: `
        <div>
            <div v-for="(value,key,index) in componentData"
                 :key="index"
                 class="fromsTab"
            >
                <b-btn v-b-toggle="'collapse'+index" variant="init" class="m-1 p-1 collapseCditStyle">
                    {{key}}
                    <b-button size="sm" variant="outline-danger" class="collapseCditBtnStyle">✕</b-button>
                    <b-button size="sm" variant="outline-success" class="collapseCditBtnStyle">✚</b-button>
                </b-btn>
                <b-collapse :visible="index == 0 || lock"
                            :id="'collapse'+index"
                >
                    <b-card>

                        <!-- froms Text -->
                        <b-form-group v-for="(value2,key2,index2) in componentData[key]"
                                      :key="index2"
                                      v-if="value2.type == 'text'"
                                      :id="'exampleInputGroup'+index2"
                                      :label="value2.name"
                                      :label-for="'exampleInput1'+index2"
                                      :description="value2.subDesc"
                        >
                            <b-form-input :id="'exampleInput'+index2"
                                          type="text"
                                          v-model="value2.description"
                                          :required="value2.isRequired"
                            ></b-form-input>
                        </b-form-group>



                    </b-card>
                </b-collapse>
            </div>
        </div>
        `,
        data() {
            return  {
                isEdit: false
            }
        },
        props: ['componentData','lock'],
        methods: {
            /*embedForms(){
                console.log(Object.keys(this.componentData).length);
                console.log(this.componentData["level1-1"]["item1"].name);
            }*/
        }
    }
    let tcComponentPartCombination = {
        template: `
        <transition-group tag="div"
                          enter-active-class="animated tada"
                          leave-active-class="animated tada"
        >
            <div v-for="(value,key,index) in componentData"
                 :key="index"
                 class="fromsTab"
            >
                <b-btn v-b-toggle="'collapse'+index" variant="init" class="m-1 p-1 collapseCditStyle">
                    {{key}}
                    <b-button size="sm" variant="outline-danger" class="collapseCditBtnStyle">✕</b-button>
                    <b-button size="sm" variant="outline-success" class="collapseCditBtnStyle">✚</b-button>
                </b-btn>
                <b-collapse :visible="index == 0" :id="'collapse'+index">
                    <b-card>
                        
                    </b-card>
                </b-collapse>
            </div>
        </transition-group>
        `,
        props: ['componentData']
    }

    let componentModule = {
        template: `
        <b-tabs>
            <b-tab title="English"
                   v-if="entag"
                   :active="enActive"
            >
                <en-component-part-combination :componentData="encomponents" :lock="lock"></en-component-part-combination>
            </b-tab>
            <b-tab title="T-Chinese"
                   v-if="tctag"
                   :active="tcActive"
            >
                <tc-component-part-combination :componentData="tccomponents"></tc-component-part-combination>
            </b-tab>
            <b-tab title="S-Chinese"
                   v-if="sctag"
                   :active="scActive"
            >
                <sc-component-part-combination :componentData="sccomponents"></sc-component-part-combination>
            </b-tab>
        </b-tabs>
        `,
        props: {
            entag: {
              type: Boolean,
              default: false
            },
            tctag: {
              type: Boolean,
              default: false
            },
            sctag: {
              type: Boolean,
              default: false
            },
            active: {
                type: String,
                required: true
            },
            lock: {
                type: Boolean,
                default: false
            },
            encomponents: {
                type: Object
            },
            tccomponents: {
                type: Object
            },
            sccomponents: {
                type: Object
            }
        },
        computed: {
            enActive(){
                //return {'english':true}[this.active] || false;
                return this.active === 'english' ? true : false;
            },
            tcActive(){
                return this.active === 'tchinese' ? true : false;
            },
            scActive(){
                return this.active === 'schinese' ? true : false;
            }
        },
        methods: {
            
        },
        components: {
            enComponentPartCombination,
            tcComponentPartCombination
        }
    };

    let vm = new Vue({
        el: "#app",
        data: {
            layoutData: layoutsData,
            editingComponentPath: '',
            lock: false,
            componentData: [
                {
                    "name": null,
                    "file": null,
                    "english": false,
                    "tchinese": false,
                    "schinese": false,
                    "active": ""
                },
                {}, {}, {}
            ]
        },
        components: {
            componentModule
        },
        methods: {
            componentModeChange(type) {
                console.log("component type: ", type);
                this.layoutData[0].active = type;
                let nowEditComponentPath = "";

                if (type === "commonSetting") {
                    this.layoutData[1].commonSetting.some((e) => {
                        if (e.active === true) {
                            nowEditComponentPath = e.path;
                            return true;
                        }
                    })
                } else {
                    this.layoutData[1].components.some((e) => {
                        if (e.active === true) {
                            nowEditComponentPath = e.path;
                            return true;
                        }
                    })
                }

                this.editingComponentPath = nowEditComponentPath;
                this.loadComponentData();
                this.lockAndUnlockStatus();
                this.$root.$emit("bv::hide::tooltip");
            },
            loadComponentData() {

                this.$http.get(this.editingComponentPath).then((response) => {
                    //console.log(response.body[1]);
                    this.componentData = response.body;
                }, (response) => {
                    console.log("component ajax error");
                });
            },
            lockComponent(){
                console.log("lock. now  mode is: ", this.layoutData[0].active);
                if (this.layoutData[0].active === "commonSetting") {
                    this.layoutData[1].commonSetting.some((e) => {
                        if (e.active === true) {
                            e.lockStatus = true;
                            return true;
                        }
                    });
                } else {
                    this.layoutData[1].components.some((e) => {
                        if (e.active === true) {
                            e.lockStatus = true;
                            return true;
                        }
                    });
                }
                this.lockAndUnlockStatus();
                this.$root.$emit("bv::hide::tooltip");
            },
            unLockComponent(){
                if (this.layoutData[0].active === "commonSetting") {
                    this.layoutData[1].commonSetting.some((e) => {
                        if (e.active === true) {
                            e.lockStatus = false;
                            return true;
                        }
                    });
                } else {
                    this.layoutData[1].components.some((e) => {
                        if (e.active === true) {
                            e.lockStatus = false;
                            return true;
                        }
                    });
                }
                this.lockAndUnlockStatus();
                this.$root.$emit("bv::hide::tooltip");
            },
            lockAndUnlockStatus(){
                if (this.layoutData[0].active === "commonSetting") {
                    this.layoutData[1].commonSetting.some((e) => {
                        if (e.active === true && e.lockStatus === true) {
                            this.lock = true;
                        } else if (e.active === true) {
                            this.lock = false;
                        }
                    });
                }else{
                    this.layoutData[1].components.some((e) => {
                        if (e.active === true && e.lockStatus === true) {
                            this.lock = true;
                        } else if (e.active === true){
                            this.lock = false;
                        }
                    });
                }
            },
            selectComponent(component, mode){
                console.log("selectComponent click:",component);
                console.log("selectComponent mode:",mode);
                if(mode === "commonSetting"){
                    this.layoutData[1].commonSetting.some((e)=>{
                        e.active = false;
                    })
                    component.active = true;
                    this.editingComponentPath = component.path;
                    this.loadComponentData();
                    this.lockAndUnlockStatus();
                }else{
                    this.layoutData[1].components.some((e)=>{
                        e.active = false;
                    })
                    component.active = true;
                    this.editingComponentPath = component.path;
                    this.loadComponentData();
                    this.lockAndUnlockStatus();
                }
            }
        },
        created() {
            //console.log("created: ",this.layoutData);
            let nowComponentStatus = "";
            let nowEditComponentPath = "";
            nowComponentStatus = this.layoutData[0].active;

            if (nowComponentStatus === "commonSetting") {
                this.layoutData[1].commonSetting.some((e) => {
                    if (e.active === true) {
                        nowEditComponentPath = e.path;
                        return true;
                    }
                })
            } else {
                this.layoutData[1].components.some((e) => {
                    if (e.active === true) {
                        nowEditComponentPath = e.path;
                        return true;
                    }
                })
            }
            this.editingComponentPath = nowEditComponentPath;
            this.loadComponentData();

        }
    });
    Vue.config.devtools = true;

})();