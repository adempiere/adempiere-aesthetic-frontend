import ContextMenu from '@/ADempiere/modules/window/components/ContextMenu'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinForm from '../../components/Form/MixinForm'
import fieldList from './fieldList'
import Template from './template.vue'

@Component({
  name: 'TestView',
  mixins: [Template, MixinForm],
  components: {
    ContextMenu
  }
})
export default class TestView extends Mixins(MixinForm) {
    @Prop({
      type: Object,
      default: {
        containerUuid: 'Test-View',
        name: 'Test View'
      }
    })
    metadata: any = {
      containerUuid: 'Test-View',
      name: 'Test View'
    }

    fieldsList: any[] = fieldList
    isCustomForm = true
    // eslint-disable-next-line
    unsubscribe: Function = () => {}

    // Computed properties
    get formTitle(): string {
      return this.metadata.name || this.$route.meta.title
    }

    // Methods
    subscribeChanges() {
      return this.$store.subscribe(mutation => {
        if (mutation.type === 'addActionKeyPerformed') {
          console.log(mutation)
        }
      })
    }

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
