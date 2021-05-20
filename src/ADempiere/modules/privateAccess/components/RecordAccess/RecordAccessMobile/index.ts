import { IRoleData } from '@/ADempiere/modules/user'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import { IRecordAccessRoleDataExtended } from '../../../PrivateAccessType'
import MixinRecordAccess from '../MixinRecordAccess'
import Template from './template.vue'

@Component({
  name: 'RecordAccessMobile',
  mixins: [Template, MixinRecordAccess]
})
export default class RecordAccessMobile extends Mixins(MixinRecordAccess) {
  @Prop({
    type: String,
    default: undefined
  }) parentUuid?: string

  @Prop({
    type: String,
    default: undefined
  }) containerUuid?: string

  @Prop({
    type: String,
    default: undefined
  }) order?: string

  @Prop({
    type: String,
    default: undefined
  }) included?: string

  @Prop({
    type: String,
    default: undefined
  }) keyColumn?: string

  @Prop({
    type: Array,
    default: undefined
  }) identifiersList?: any[]

  // Data
  group = 'sequence'
  isReadonly = false
  isDependentEntities = false
  public labelListInclude: any[] = []
  public labelListExcludo: any[] = []

  // Computed properties
  get listExclude(): string[] {
    return this.excludedList.map(element => {
      return element.roleName
    })
  }

  get listInclude(): string[] {
    return this.includedList.map(element => {
      return element.roleName
    })
  }

  // Methods

  addListInclude(element: string[]): void {
    const index: number = this.recordAccess.roles.findIndex(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index >= 0) {
      this.addItem({
        index,
        element: this.recordAccess.roles[index]
      })
    }
  }

  addListExclude(element: string[]): void {
    const index: number = this.recordAccess.roles.findIndex(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index >= 0) {
      this.deleteItem({
        index,
        element: this.recordAccess.roles[index]
      })
    }
  }

  SendRecorAccess(list: IRecordAccessRoleDataExtended[]) {
    list.forEach(element => {
      element.isReadOnly = this.isReadonly
      element.isDependentEntities = this.isDependentEntities
    })
    this.saveRecordAccess(list)
  }
}
