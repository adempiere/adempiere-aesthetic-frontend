import { IRoleData } from '@/ADempiere/modules/user'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import Draggable from 'vuedraggable'
import MixinRecordAccess from '@/ADempiere/modules/privateAccess/components/RecordAccess/MixinRecordAccess'

@Component({
  name: 'RecordAccessDesktop',
  mixins: [Template, MixinRecordAccess],
  components: {
    Draggable
  }
})
export default class RecordAccessDesktop extends Mixins(MixinRecordAccess) { }
