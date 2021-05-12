import { IRoleData } from '@/ADempiere/modules/user'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import Draggable from 'vuedraggable'

@Component({
  name: 'RecordAccessDesktop',
  mixins: [Template],
  components: {
    Draggable
  }
})
export default class RecordAccessDesktop extends Vue {
  @Prop({
    type: String,
    default: undefined
  })
  parentUuid?: string

  @Prop({
    type: String,
    default: undefined
  })
  containerUuid?: string

  @Prop({
    type: String,
    default: undefined
  })
  order?: string

  @Prop({
    type: String,
    default: undefined
  })
  included?: string

  @Prop({
    type: String,
    default: undefined
  })
  keyColumn?: string

  @Prop({
    type: Array,
    default: undefined
  })
  identifiersList?: any[]

  // Data
  private group = 'sequence'
  private isReadonly = false
  private isDependentEntities = true
  private getterDataRecords: IRoleData[] = this.$store.getters[
    Namespaces.User + '/' + 'getRoles'
  ]

  // Computed properties
  get getterListExclude(): IRoleData[] {
    return this.getterDataRecords.filter(item => item.isPersonalLock === false)
  }

  get getterListInclude(): IRoleData[] {
    return this.getterDataRecords.filter(item => item.isPersonalLock === true)
  }

  get getIdentifiersList(): any[] | undefined {
    return this.identifiersList?.filter(
      item => item.componentPath !== 'FieldSelect'
    )
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
  handleChange(value: IKeyValueObject): void {
    const action = Object.keys(value)[0] // get property
    const element = value[action].element
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

  /**
   * @param {number} index: the index of the added element
   * @param {object} element: the added element
   */
  addItem(params: {
    index: number
    element: any
  }): void {
    const { index, element } = params
    this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
  }

  /**
   * @param {number} index: the index of the element before remove
   * @param {object} element: the removed element
   */
  deleteItem(params: {
    index: number
    element: any
  }): void {
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
