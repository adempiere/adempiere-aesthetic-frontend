import { Vue, Component, Prop } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'Calendar',
  mixins: [Template]
})
export default class Calendar extends Vue {
    @Prop({ type: Object, required: true }) metadata: any
    public value: Date = new Date()
}
