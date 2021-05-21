import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getRecordAccess, setRecordAccess } from '../../PrivateAccessService/RecordAccess'
import { IRecordAccessDataExtended, IRecordAccessRoleData, IRecordAccessRoleDataExtended } from '../../PrivateAccessType'
import language from '@/ADempiere/shared/lang'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'MixinRecordAccess'
})
export default class MixinRecordAccess extends Vue {
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

    @Prop({
      type: Object,
      default: () => {}
    }) record: any

    @Prop({
      type: String,
      default: undefined
    }) tableName?: string

    // Data
    public group = 'sequence'
    public isReadonly = false
    public isDependentEntities = true
    public recordAccess: { recordUuid: string, roles: IRecordAccessRoleDataExtended[], tableName?: string, recordId?: number } = {
      recordUuid: '',
      roles: []
    }

    // Computed
    get excludedList(): IRecordAccessRoleDataExtended[] {
      if (this.recordAccess.roles) {
        return this.recordAccess.roles.filter(role => !role.isRoleConfig)
      } else {
        return []
      }
    }

    set excludedList(value: IRecordAccessRoleDataExtended[]) {}

    set includedList(value: IRecordAccessRoleDataExtended[]) {}

    get includedList(): IRecordAccessRoleDataExtended[] {
      if (this.recordAccess.roles) {
        return this.recordAccess.roles.filter(role => role.isRoleConfig)
      } else {
        return []
      }
    }

    get getIdentifiersList() {
      return this.identifiersList?.filter(item => item.componentPath !== 'FieldSelect')
    }

    // Hooks
    created() {
      getRecordAccess({
        tableName: this.tableName!,
        recordId: this.record[this.tableName + '_ID'],
        recordUuid: this.record.UUID
      })
        .then((access: Partial<IRecordAccessDataExtended>) => {
          this.recordAccess.tableName = access.tableName
          this.recordAccess.recordId = access.recordId
          this.recordAccess.recordUuid = access.recordUuid!
            access.availableRoles!.forEach(role => {
              this.recordAccess.roles.push({
                ...role,
                isRoleConfig: false,
                isLocked: role.isExclude
              })
            })
            access.currentRoles?.forEach(role => {
              this.recordAccess.roles.find((availableRole: IRecordAccessRoleDataExtended) => availableRole.roleId === role.roleId)!.isLocked = role.isExclude
              this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId)!.isRoleConfig = true
              this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId)!.isDependentEntities = role.isDependentEntities
              this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId)!.isReadOnly = role.isReadOnly
              this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId)!.isExclude = role.isExclude
            })
        })
    }

    // Methods
    handleChange(value: any) {
      const action: string = Object.keys(value)[0] // get property
      const element = value[action].element
      const index: number = this.recordAccess.roles.findIndex(role => role.roleId === element.roleId)
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
    addItem(data: {
        index: number
        element: any
      }) {
      const { index, element } = data
      this.recordAccess.roles[index].isRoleConfig = true
    }

    /**
       * @param {number} index: the index of the element before remove
       * @param {object} element: the removed element
       */
    deleteItem(data: {
        index: number
        element: any
      }) {
      const { index, element } = data
      this.recordAccess.roles[index].isRoleConfig = false
    }

    getOrder(arrayToSort: any[], orderBy = this.order!) {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
    }

    saveRecordAccess(recordAccesses: IRecordAccessRoleData[]) {
      setRecordAccess({
        tableName: this.tableName!,
        recordId: this.record[this.tableName + '_ID'],
        recordUuid: this.record.UUID,
        recordAccesses
      })
        .then(response => {
          showMessage({
            message: language.t('grid.recordAccess.accessGranted').toString()
          })
          this.close()
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
    }

    validateList(list: IRecordAccessRoleDataExtended[]): IRecordAccessRoleDataExtended[] {
      list.forEach((element: IRecordAccessRoleDataExtended) => {
        if (element.isExclude) {
          element.isReadOnly = false
        } else {
          element.isDependentEntities = false
        }
      })
      return list
    }

    close() {
      this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
        type: 'window',
        action: undefined
      })
      this.$store.commit(Namespaces.ContextMenu + '/' + 'setRecordAccess', false)
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', false)
    }
}
