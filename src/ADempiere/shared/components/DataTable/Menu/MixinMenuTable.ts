import { IProcessData, ProcessDefinitionAction, ProcessDefinitionState } from '@/ADempiere/modules/dictionary'
import { ActionContextType, PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { exportFileFromJson, exportFileZip, supportedTypes } from '@/ADempiere/shared/utils/exportUtil'
import { FIELDS_QUANTITY } from '@/ADempiere/shared/utils/references'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { clientDateTime, recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { BookType } from 'xlsx/types'
import MixinTable from '../Mixin/MixinTable'

@Component({
  name: 'MixinMenuTable',
  mixins: [MixinTable]
})
export default class MixinMenuTable extends Mixins(MixinTable) {
  // eslint-disable-next-line
    @Prop({ type: Object, default: () => {} }) currentRow: any
    @Prop({ type: Array, default: () => [] }) processMenu!: any[]
    @Prop({ type: String, default: 'xlsx' }) defaultFormatExport!: string

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
      this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
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
        this.$store.dispatch(Namespaces.Utils + '/' + 'setProcessSelect', {
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
        this.$store.dispatch(Namespaces.Utils + '/' + 'setProcessTable', {
          valueRecord: valueProcess,
          tableName: this.panelMetadata.keyColumn,
          processTable: true
        })
      }
      if (processData === undefined) {
        this.$store.dispatch(Namespaces.ProcessDefinition + '/' + 'getProcessFromServer', {
          containerUuid: process.uuid,
          routeToDelete: this.$route
        })
          .then(response => {
            this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
              type: process.type,
              action: response,
              record: this.getDataSelection
            })
          }).catch(error => {
            console.warn(`ContextMenu: Dictionary Process (State) - Error ${error.code}: ${error.message}.`)
          })
      } else {
        this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
          type: process.type,
          action: processData
        })
      }
    }

    showTotals(): void {
      this.$store.dispatch(Namespaces.Panel + '/' + 'changePanelAttributesBoolean', {
        containerUuid: this.containerUuid,
        attributeName: 'isShowedTotals'
      })
    }

    showOnlyMandatoryColumns(): void {
      this.$store.dispatch(Namespaces.Panel + '/' + 'showOnlyMandatoryColumns', {
        containerUuid: this.containerUuid
      })
    }

    showAllAvailableColumns(): void {
      this.$store.dispatch(Namespaces.Panel + '/' + 'showAllAvailableColumns', {
        containerUuid: this.containerUuid
      })
    }

    addNewRow(): void {
      if (this.newRecordsQuantity <= 0) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'addNewRow', {
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
      this.$store.dispatch(Namespaces.Panel + '/' + 'changePanelAttributesBoolean', {
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

      let title = this.panelMetadata.name
      if (!title) {
        title = this.$route.meta.title
      }

      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header,
        data,
        fileName: `${title} ${clientDateTime()}`,
        exportType: <BookType>formatToExport
      })
      this.closeMenu()
    }

    /**
     * Export record as .txt into compressed .zip file
     */
    exporZipRecordTable(recordContextMenu?: boolean): void {
      recordContextMenu = recordContextMenu || false
      const header = this.getterFieldsListHeader
      const filterVal = this.getterFieldsListValue
      let list = this.getDataSelection
      if (this.getDataSelection.length <= 0) {
        list = this.recordsData
      }
      if (recordContextMenu) {
        list = [this.currentRow]
      }
      const data = this.formatJson(filterVal, list)
      let title = this.panelMetadata.name
      if (!title) {
        title = this.$route.meta.title
      }
      exportFileZip({
        header,
        data,
        txtName: this.$route.meta.title,
        zipName: `${title} ${clientDateTime()}`
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
      const browserMetadata = this.$store.getters[Namespaces.BrowserDefinition + '/' + 'getBrowser'](this.$route.meta.uuid)
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
