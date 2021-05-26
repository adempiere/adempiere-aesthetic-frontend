import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'MixinContextMenuField'
})
export default class MixinContextMenuField extends Vue {
    @Prop({ type: Boolean, default: false }) visible?: boolean

    @Watch('visible')
    handleVisibleChange(newValue: boolean, oldValue: boolean) {
      if (newValue === false && oldValue === true) {
        this.$router.push({
          name: this.$route.name!,
          query: {
            ...this.$route.query,
            typeAction: ''
          }
        }).catch(() => {})
      }
    }
}
