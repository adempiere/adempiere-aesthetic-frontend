import { IProcessData, ProcessDefinitionAction, ProcessDefinitionState } from '@/ADempiere/modules/dictionary'
import { ActionContextType, PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { exportFileFromJson, exportFileZip, supportedTypes } from '@/ADempiere/shared/utils/exportUtil'
import { FIELDS_QUANTITY } from '@/ADempiere/shared/utils/references'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { BookType } from 'xlsx/types'
import MixinTable from '../Mixin/MixinTable'

@Component({
  name: 'MixinMenuTable',
  mixins: [MixinTable]
})
export default class MixinMenuTable extends Mixins(MixinTable) {
    @Prop({ type: Object, default: () => Object }) currentRow: any
    @Prop({ type: Array, default: () => [] }) processMenu: any[] = []
    @Prop({ type: Object, default: () => Object }) panelMetadata: any
    @Prop({ type: String, default: 'xlsx' })
    defaultFormatExport = 'xlsx'

    public menuType?: string
    public supportedTypes = supportedTypes
    public menuTable = '1'
    public isCollapse = true

    // Computed properties
    get classTableMenu(): 'menu-table-mobile' | 'menu-table' {
      if (this.isMobile) {
        return 'menu-table-mobile'
      }
      return 'menu-table'
    }

    get fieldsList(): IFieldDataExtendedUtils[] {
      if (this.panelMetadata && this.panelMetadata.fieldsList) {
        return this.panelMetadata.fieldsList
      }
      return []
    }

    get getterFieldsList(): IFieldDataExtendedUtils[] {
      return this.$store.getters[
        Namespaces.Panel + '/' + 'getFieldsListFromPanel'
      ](this.containerUuid)
    }

    get isFieldsQuantity(): boolean {
      const fieldsQuantity = this.getterFieldsList.filter(
        (fieldItem: any) => {
          return FIELDS_QUANTITY.includes(fieldItem.displayType)
        }
      ).length
      return !fieldsQuantity
    }

    get getterFieldsListHeader(): string[] {
      const header: IFieldDataExtendedUtils[] = this.getterFieldsList.filter(
        (fieldItem: IFieldDataExtendedUtils) => {
          const isDisplayed: boolean =
                    fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
          if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
            return fieldItem.name
          }
        }
      )
      return header.map((fieldItem: IFieldDataExtendedUtils) => {
        return fieldItem.name
      })
    }

    get getterFieldsListValue(): string[] {
      const value: IFieldDataExtendedUtils[] = this.getterFieldsList.filter(
        fieldItem => {
          const isDisplayed: boolean =
                    fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
          if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
            return fieldItem
          }
        }
      )
      return value.map((fieldItem: IFieldDataExtendedUtils) => {
        if (fieldItem.componentPath === 'FieldSelect') {
          return fieldItem.displayColumnName!
        }
        return fieldItem.columnName
      })
    }

    get permissionRoutes(): RouteConfig[] {
      return this.$store.getters.permission_routes
    }

    // Methods
    sortTab(actionSequence: ProcessDefinitionAction) {
      // TODO: Refactor and remove redundant dispatchs
      this.$store.dispatch('setShowDialog', {
        type: PanelContextType.Window,
        action: actionSequence,
        parentRecordUuid: this.$route.query.action
      })
    }

    showModalTable(process: ProcessDefinitionAction): void {
      if (process.type === ActionContextType.Application) {
        this.sortTab(process)
        return
      }

      const processData: IProcessData = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess'](process.uuid)
      if (!this.currentRow) {
        this.$store.dispatch('setProcessSelect', {
          selection: this.getDataSelection,
          processTablaSelection: true,
          tableName: this.panelMetadata.keyColumn
        })
      } else {
        let valueProcess
        const selection = this.currentRow
        for (const element in selection) {
          if (element === this.panelMetadata.keyColumn) {
            valueProcess = selection[element]
          }
        }
        this.$store.dispatch('setProcessTable', {
          valueRecord: valueProcess,
          tableName: this.panelMetadata.keyColumn,
          processTable: true
        })
      }
      if (processData === undefined) {
        this.$store.dispatch('getProcessFromServer', {
          containerUuid: process.uuid,
          routeToDelete: this.$route
        })
          .then(response => {
            this.$store.dispatch('setShowDialog', {
              type: process.type,
              action: response,
              record: this.getDataSelection
            })
          }).catch(error => {
            console.warn(`ContextMenu: Dictionary Process (State) - Error ${error.code}: ${error.message}.`)
          })
      } else {
        this.$store.dispatch('setShowDialog', {
          type: process.type,
          action: processData
        })
      }
    }

    showTotals(): void {
      this.$store.dispatch('changePanelAttributesBoolean', {
        containerUuid: this.containerUuid,
        attributeName: 'isShowedTotals'
      })
    }

    showOnlyMandatoryColumns(): void {
      this.$store.dispatch('showOnlyMandatoryColumns', {
        containerUuid: this.containerUuid
      })
    }

    showAllAvailableColumns(): void {
      this.$store.dispatch('showAllAvailableColumns', {
        containerUuid: this.containerUuid
      })
    }

    addNewRow(): void {
      if (this.newRecordsQuantity <= 0) {
        this.$store.dispatch('addNewRow', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          fieldsList: this.fieldsList,
          isEdit: true,
          isSendServer: false
        })
        return
      }
      const fieldsEmpty: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory'].getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid
      })
      this.$message({
        message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty.toString(),
        showClose: true,
        type: 'info'
      })
    }

    showOptionalColums(): void {
      this.$store.dispatch('changePanelAttributesBoolean', {
        containerUuid: this.containerUuid,
        attributeName: 'isShowedTableOptionalColumns'
      })
    }

    /**
       * @param {string} formatToExport
       */
    exporRecordTable(formatToExport: string) {
      const header = this.getterFieldsListHeader
      const filterVal = this.getterFieldsListValue

      let list = []
      if (this.menuType === 'tableContextMenu') {
        list = [this.currentRow]
      } else {
        list = this.getDataSelection
      }

      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header,
        data,
        // filename: '',
        exportType: <BookType>formatToExport
      })
      this.closeMenu()
    }

    exporZipRecordTable(): void {
      const header = this.getterFieldsListHeader
      const filterVal = this.getterFieldsListValue
      let list = this.getDataSelection
      if (this.getDataSelection.length <= 0) {
        list = this.recordsData
      }
      const data = this.formatJson(filterVal, list)
      exportFileZip({
        header,
        data,
        title: this.$route.meta.title
        // exportType: 'zip'
      })
    }

    formatJson(filterVal: any[], jsonData: any[]): any[][] {
      return jsonData.map(row => {
        return filterVal.map(column => {
          return row[column]
        })
      })
    }

    zoomRecord(): void {
      const browserMetadata = this.$store.getters.getBrowser(this.$route.meta.uuid)
      const { elementName } = browserMetadata.fieldsList.find((field: IFieldDataExtendedUtils) => field.columnName === browserMetadata.keyColumn)
      const records: any[] = []
      this.getDataSelection.forEach(recordItem => {
        let record = recordItem[browserMetadata.keyColumn]
        if (!isNaN(record)) {
          record = Number(record)
        }
        records.push(record)
      })

      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: browserMetadata.window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })
      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            [elementName]: records
          }
        }, undefined)
      }
    }
}