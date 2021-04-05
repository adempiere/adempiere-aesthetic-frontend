import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins } from 'vue-property-decorator'
import MixinInfo from '../mixinInfo'
import { IWorkflowProcessData } from '@/ADempiere/modules/window/WindowType'
import Template from './template.vue'

@Component({
  name: 'WorkflowLogs',
  mixins: [Template, MixinInfo]
})
export default class WorkflowLogs extends Mixins(MixinInfo) {
  // Computed properties
  get gettersListWorkflow(): IWorkflowProcessData[] {
    return this.$store.getters[
      Namespaces.ContainerInfo + '/' + 'getNodeWorkflow'
    ]
  }

  get getIsWorkflowLog(): boolean {
    if (!this.gettersListWorkflow) {
      return false
    }
    return true
  }
}
