import { IRoleData } from '@/ADempiere/modules/user'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue, Prop } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'RecordAccessMobile',
  mixins: [Template]
})
export default class RecordAccessMobile extends Vue {
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
  private group = 'sequence'
  private isReadonly = false
  private isDependentEntities = true
  private getterDataRecords: IRoleData[] = this.$store.getters[
    Namespaces.User + '/' + 'getRoles']

  // Computed properties
  get getterListExclude(): string[] {
    const list: IRoleData[] = this.getterDataRecords.filter(item => item.isPersonalLock === false)
    return list.map(element => {
      return element.name
    })
  }

  get getterListInclude(): string[] {
    const list: IRoleData[] = this.getterDataRecords.filter(item => item.isPersonalLock === true)
    return list.map(element => {
      return element.name
    })
  }

  get getIdentifiersList(): any[] | undefined {
    return this.identifiersList?.filter(item => item.componentPath !== 'FieldSelect')
  }

  // Hooks
  created() {
    const record = this.getterDataRecords.map(record => {
      return {
        id: record.id,
        uuid: record.uuid,
        IsExclude: record.isPersonalLock,
        isDependentEntities: this.isDependentEntities,
        isReadonly: this.isReadonly
      }
    })
    this.$store.dispatch(Namespaces.AccessRecord + '/' + 'changeList', record)
  }

  // Methods
  handleChange(value: IKeyValueObject) {
    const action: string = Object.keys(value)[0] // get property
    const element: any = value[action].element
    const index = this.getterDataRecords.findIndex(role => role.id === element.id)
    switch (action) {
      case 'added':
        this.addItem({
          index,
          element
        })
        break
      case 'removed':
        this.deleteItem({
          index,
          element
        })
        break
    }
  }

  addListInclude(element: string[]): void {
    const index = this.getterDataRecords.findIndex(item => element[element.length - 1] === item.uuid)
    this.getterDataRecords[index].isPersonalLock = true
  }

  addListExclude(element: string[]): void {
    const index = this.getterDataRecords.findIndex(item => element[element.length - 1] === item.uuid)
    this.getterDataRecords[index].isPersonalLock = false
  }

  /**
   * @param {number} index: the index of the added element
   * @param {object} element: the added element
   */
  addItem(params: {
    index: number
    element: IKeyValueObject
  }) {
    const { index, element } = params
    this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
  }

  /**
   * @param {number} index: the index of the element before remove
   * @param {object} element: the removed element
   */
  deleteItem(params: {
    index: number
    element: IKeyValueObject
  }) {
    const { index, element } = params
    this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
    const record = this.getterDataRecords.map(record => {
      return {
        id: record.id,
        uuid: record.uuid,
        IsExclude: record.isPersonalLock,
        isDependentEntities: this.isDependentEntities,
        isReadonly: this.isReadonly
      }
    })
    this.$store.dispatch(Namespaces.AccessRecord + '/' + 'changeList', record)
  }

  getOrder(arrayToSort: any[], orderBy?: string) {
    orderBy = (orderBy) || this.order
    return arrayToSort.sort((itemA, itemB) => {
      const itemAObj = itemA as IKeyValueObject
      const itemBObj = itemB as IKeyValueObject
      return itemAObj[orderBy!] - itemBObj[orderBy!]
    })
  }
}
