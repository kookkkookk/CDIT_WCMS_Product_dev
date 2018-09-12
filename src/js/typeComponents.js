Vue.component("componentTypeText", {
    template: `
    <div>
        <b-form-group v-for="(value2,key2,index2) in componentData"
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
    </div>
    `,
    props: ['componentData', 'islock']
});