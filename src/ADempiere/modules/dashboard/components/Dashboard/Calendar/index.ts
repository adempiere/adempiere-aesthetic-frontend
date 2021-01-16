import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Calendar'
})
export default class Calendar extends Vue {
    @Prop({ type: Object, required: true }) metadata: any
    public value: Date = new Date()
}
