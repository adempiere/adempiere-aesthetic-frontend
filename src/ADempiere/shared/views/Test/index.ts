import ContextMenu from '@/ADempiere/modules/window/components/ContextMenu'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinForm from '../../components/Form/MixinForm'
import { Namespaces } from '../../utils/types'
import fieldList from './fieldList'
import Template from './template.vue'
import TitleAndHelp from '@/ADempiere/shared/components/TitleAndHelp'

@Component({
  name: 'TestView',
  mixins: [Template, MixinForm],
  components: {
    ContextMenu,
    TitleAndHelp
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

    fieldsList = fieldList
    isCustomForm = true
    // eslint-disable-next-line
    unsubscribe: Function = () => {}

    // Methods
    subscribeChanges() {
      return this.$store.subscribe(mutation => {
        if (mutation.type === Namespaces.Event + '/' + 'addActionKeyPerformed') {
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
