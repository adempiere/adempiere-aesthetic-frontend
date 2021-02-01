import { Component, Mixins, Prop, Ref, Watch } from 'vue-property-decorator'
import MixinTable from './Mixin/MixinTable'
import MixinTableSort from './Mixin/MixinTableSort'
import Template from './template.vue'
import CustomPagination from '@/ADempiere/shared/components/Pagination'
import FieldDefinition from '@/ADempiere/shared/components/Field'
import FilterColumns from './FilterColumns'
import FixedColumns from './FixedColumns'
import IconElement from '../IconElement'
import TableMainMenu from './Menu'
import TableContextMenu from './Menu/TableContextMenu'
import MainPanel from '@/ADempiere/shared/components/Panel'
import { Namespaces } from '../../utils/types'
import { IContextActionData, IContextMenuData } from '@/ADempiere/modules/window/WindowType/VuexType'
import { ActionContextType, PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { IBrowserDataExtended, IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import { fieldIsDisplayed, sortFields } from '../../utils/DictionaryUtils'
import { IFieldDataExtendedUtils } from '../../utils/DictionaryUtils/type'
import { typeValue } from '../../utils/valueUtils'
import { formatField } from '../../utils/valueFormat'
import { FIELDS_DECIMALS, FIELDS_QUANTITY, FIELDS_READ_ONLY_FORM, IFieldFormType } from '../../utils/references'
import { ElInput } from 'element-ui/types/input'
import { IFieldConditionData, IFieldDefinitionData } from '@/ADempiere/modules/field/FieldType'
import evaluator from '../../utils/evaluator'

@Component({
  name: 'DataTable',
  mixins: [Template, MixinTable, MixinTableSort],
  components: {
    CustomPagination,
    FieldDefinition,
    FilterColumns,
    FixedColumns,
    IconElement,
    MainPanel,
    TableContextMenu,
    TableMainMenu
  }
})
export default class DataTable extends Mixins(MixinTable, MixinTableSort) {
    @Prop({ type: Boolean, default: true }) isTableSelection!: boolean
    @Prop({ type: Boolean, default: true }) isShowedPanelRecord!: boolean
    @Ref() readonly headerSearchInput!: ElInput
    public topContextualMenu = 0
    public leftContextualMenu = 0
    public currentRowMenu: any = {}
    public currentRow: any = null
    public currentTable = 0
    public visible: boolean = this.getShowContextMenuTable
    public searchTable = '' // text from search
    public defaultMaxPagination = 50
    // const activeName = []
    // TODO: Manage attribute with vuex store in window module
    // if (this.isParent && this.$route.query.action && this.$route.query.action === 'advancedQuery') {
    //   activeName.push('PanelAdvancedQuery')
    // }
    public activeName: string[] = []
    // if(this.isParent && this.$route.query.action && this.$route.query.action === 'advancedQuery'){
    //     activeName.push('PanelAdvancedQuery')
    // }
    public rowStyle = {
      height: '52px'
    }

    public uuidCurrentRecordSelected = ''
    public showTableSearch = false

    // Computed properties
    get isShowedContextMenu() {
      if (this.isParent) {
        return this.getShowContextMenuTable
      }
      return this.getShowContextMenuTabChildren
    }

    get getMenuTable(): IContextActionData[] {
      const process: IContextMenuData | undefined = this.$store.getters[Namespaces.ContextMenu + '/' + 'getContextMenu'](this.containerUuid)
      if (process && (process.actions)) {
        return process.actions.filter((menu: IContextActionData) => {
          if (menu.type === ActionContextType.Process || menu.type === ActionContextType.Application) {
            return menu
          }
        })
      }
      return []
    }

    get getShowContextMenuTable(): boolean {
      return this.$store.getters[Namespaces.Utils + '/' + 'getShowContextMenuTable']
    }

    get getShowContextMenuTabChildren(): boolean {
      return this.$store.getters[Namespaces.Utils + '/' + 'getShowContextMenuTabChildren']
    }

    // get panelMetadata(): IPanelDataExtended | undefined {
    //   return this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](this.containerUuid)
    // }

    get isLoadedPanel(): boolean {
      const panelMetadata: IPanelDataExtended | undefined = this.$store.getters[Namespaces.Panel + '/' + 'getPanel']('table_' + this.containerUuid)
      if (panelMetadata) {
        return true
      }
      return false
    }

    get isShowedTotals(): boolean | undefined {
      if (this.panelMetadata) {
        return this.panelMetadata.isShowedTotals
      }
    }

    get isShowOptionalColumns(): boolean | undefined {
      if (this.panelMetadata) {
        return this.panelMetadata.isShowedTableOptionalColumns
      }
    }

    get totalRecords(): number {
      return this.getterDataRecordsAndSelection.recordCount
    }

    get pageNumber(): number {
      return this.getterDataRecordsAndSelection.pageNumber
    }

    get isLoaded(): boolean {
      return !this.getterDataRecordsAndSelection.isLoaded
    }

    get fieldsIsDisplayed() {
      return this.$store.getters[Namespaces.Panel + '/' + 'getFieldsIsDisplayed'](this.containerUuid)
    }

    get getterIsShowedCriteria(): boolean {
      const browser: IBrowserDataExtended | undefined = this.$store.getters[Namespaces.BrowserDefinition + '/' + 'getBrowser'](this.containerUuid)
      if (browser) {
        return browser.isShowedCriteria
      }
      return false
    }

    get getHeightPanelBottom(): number {
      return this.$store.getters[Namespaces.Utils + '/' + 'getSplitHeight'] - 25
    }

    get getterHeight(): number {
      return this.$store.getters[Namespaces.Utils + '/' + 'getHeigth']
    }

    get tableHeaderStyle(): {
      height: string
      overflow?: string
      } {
      if (this.isParent) {
        if (this.activeName) {
          return {
            height: '55%',
            overflow: 'auto'
          }
        }
        return {
          height: '17%',
          overflow: 'hidden'
        }
      }
      return {
        height: '35px'
      }
    }

    get getHeigthTable(): string | number {
      let totalRow = 0
      // to refresh height table if changed isShowedTotals
      if (this.isShowedTotals) {
        totalRow = 5
      }

      if (this.isPanelWindow) {
        // table record navigation
        if (this.isParent) {
          if (!this.activeName) {
            return this.getterHeight - 210 - totalRow
          }
          // panel advanced query is showed
          return this.getterHeight - 420 - totalRow
        }
        // tabs children
        if (totalRow) {
          totalRow = 1
        }
        return (this.getHeightPanelBottom - 5 - totalRow) + 'vh'
      } else if (this.panelType === 'browser') {
        // open browser criteria
        if (this.getterIsShowedCriteria) {
          // showed some field in panel query criteria
          if (this.fieldsIsDisplayed.isDisplayed) {
            return this.getterHeight - 495 - totalRow
          }
          return this.getterHeight - 415 - totalRow
        }
        return this.getterHeight - 290 - totalRow
      }
      return this.getterHeight - 300 - totalRow
    }

    get fieldsList(): IFieldDataExtendedUtils[] {
      const panelMetadata: IPanelDataExtended | undefined = this.panelMetadata
      if (panelMetadata && panelMetadata.fieldsList) {
        if ((this.panelType === PanelContextType.Window && this.isParent) || this.panelType === PanelContextType.Browser) {
          let orderBy = 'seqNoGrid'
          if (this.panelType === 'browser') {
            orderBy = 'sequence'
          }

          return sortFields({
            fieldsList: panelMetadata.fieldsList,
            orderBy
          })
        }
        return panelMetadata.fieldsList
      }
      return []
    }

    get isLoadPanel(): boolean {
      const panelMetadata = this.panelMetadata
      if (panelMetadata && panelMetadata.fieldsList) {
        return true
      }
      return false
    }

    get preferenceClientId(): number | undefined {
      if (this.isPanelWindow) {
        return this.$store.getters[Namespaces.Preference + '/' + 'getPreferenceClientId']
      }
      return undefined
    }

    get shorcutKey() {
      return {
        f6: ['f6'],
        ctrlf: ['ctrl', 'f']
      }
    }

    get keyUp(): number {
      if (this.currentTable < 1) {
        return this.currentTable
      }
      return this.currentTable - 1
    }

    get keyDow(): number {
      const maxDown = this.recordsData.length - 1
      if (maxDown === this.currentTable) {
        return this.currentTable
      }
      return this.currentTable + 1
    }

      // Watchers
      @Watch('visible')
    handleVisiblechange(value: boolean) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }

      // Methods
      actionAdvancedQuery(): void {
        const activeNames: string[] = []
        if (!this.activeName.length) {
          activeNames.push('PanelAdvancedQuery')
          if (this.isParent) {
            const { isShowedRecordNavigation } = this.$store.getters.getWindow(this.parentUuid)
            if (!isShowedRecordNavigation) {
              this.$store.dispatch(Namespaces.WindowDefinition + '/' + 'changeWindowAttribute', {
                parentUuid: this.parentUuid, // act as parentUuid
                attributeName: 'isShowedRecordNavigation',
                attributeValue: true
              })
            }
          }
        }
        this.activeName = activeNames
      }

      setCurrent(row: any): void {
        this.multipleTable?.setCurrentRow(row)
      }

      theAction(event: any) {
        switch (event.srcKey) {
          case 'up':
            this.currentTable = this.keyUp
            break
          case 'down':
            this.currentTable = this.keyDow
            break
        }
        this.handleRowClick(this.recordsData[this.currentTable])
        return this.setCurrent(this.recordsData[this.currentTable])
      }

      block() {
        return false
      }

      rowMenu(row: any, column: any, event: any) {
        const menuMinWidth = 105
        const offsetLeft: number = this.$el.getBoundingClientRect().left // container margin left
        // const offsetWidth = this.$e..offsetWidth // container width
        const offsetWidth = (<HTMLElement> this.$el).offsetWidth // container width
        const maxLeft: number = offsetWidth - menuMinWidth // left boundary
        const left = event.clientX - offsetLeft + 15 // 15: margin right

        this.leftContextualMenu = left
        if (left > maxLeft) {
          this.leftContextualMenu = maxLeft
        }

        const offsetTop = this.$el.getBoundingClientRect().top
        let top = event.clientY - offsetTop
        if (this.panelType === 'browser' && this.panelMetadata!.isShowedCriteria) {
          top = event.clientY - 200
        }
        this.topContextualMenu = top

        this.currentRowMenu = row
        this.visible = true

        // TODO: Verify use
        this.$store.dispatch(Namespaces.Utils + '/' + 'showMenuTable', {
          isShowedTable: this.isParent
        })
        this.$store.dispatch(Namespaces.Utils + '/' + 'showMenuTabChildren', {
          isShowedTabChildren: !this.isParent
        })
      }

      headerLabel(field: any) {
        if (field.isMandatory || field.isMandatoryFromLogic) {
          return '* ' + field.name
        }
        return field.name
      }

      /**
       * @param {object} row, row data
       * @param {object} field, field with attributes
       */
      displayedValue(row: any, field: IFieldDataExtendedUtils) {
        const { columnName, componentPath, displayColumnName, displayType } = field

        let valueToShow
        switch (componentPath) {
          case 'FieldDate':
          case 'FieldTime': {
            let cell = row[columnName]
            if (typeValue(cell) === 'DATE') {
              cell = cell.getTime()
            }
            // replace number timestamp value for date
            valueToShow = formatField(cell, displayType)
            break
          }

          case 'FieldNumber':
            if (!row[columnName]) {
              valueToShow = undefined
              break
            }
            valueToShow = this.formatNumber({
              displayType,
              number: row[columnName]
            })
            break

          case 'FieldSelect':
            valueToShow = row[displayColumnName!]
            if (!valueToShow && row[columnName] === 0) {
              valueToShow = field.defaultValue
              break
            }
            break

          case 'FieldYesNo':
            // replace boolean true-false value for 'Yes' or 'Not' ('Si' or 'No' for spanish)
            valueToShow = row[columnName]
              ? this.$t('components.switchActiveText')
              : this.$t('components.switchInactiveText')
            break

          default:
            valueToShow = row[columnName]
            break
        }

        return valueToShow
      }

      rowCanBeEdited(record: any, fieldAttributes: any) {
        if (!this.isParent) {
          if (this.isPanelWindow) {
            // getter with context
            if (this.isReadOnlyParent) {
              return false
            }
            // if record is IsActive, Processed, Processing
            if (this.isReadOnlyRow(record, fieldAttributes)) {
              return false
            }
          }
          // if isReadOnly, isReadOnlyFromLogic
          if (this.isReadOnlyCell(record, fieldAttributes)) {
            return false
          }
          if (record.isEdit) {
            return true
          }
        }
        return false
      }

      isReadOnlyRow(row: any, field: any): boolean {
        // evaluate context
        if (this.preferenceClientId !== parseInt(row.AD_Client_ID, 10)) {
          return true
        }
        if (fieldIsDisplayed(field)) {
          // columnName: IsActive
          const fieldReadOnlyForm = FIELDS_READ_ONLY_FORM.find((item: IFieldFormType) => {
            return !item.isChangedAllForm &&
              // columnName: IsActive, Processed, Processing
              Object.prototype.hasOwnProperty.call(row, item.columnName)
          })
          if (fieldReadOnlyForm) {
            const { columnName, valueIsReadOnlyForm } = fieldReadOnlyForm
            // compare if is same key
            return field.columnName !== columnName &&
              // compare if is same value
              row[columnName] === valueIsReadOnlyForm
          }
        }
        return false
      }

      isReadOnlyCell(row: any, field: any) {
        // TODO: Add support to its type fields
        if (['FieldImage', 'FieldBinary'].includes(field.componentPath)) {
          return true
        }

        const isUpdateableAllFields = field.isReadOnly || field.isReadOnlyFromLogic
        if (this.isPanelWindow) {
          const panelMetadata: IPanelDataExtended | undefined = this.panelMetadata
          if (field.columnName === panelMetadata!.linkColumnName ||
            field.columnName === panelMetadata!.fieldLinkColumnName) {
            return true
          }
          // edit mode is diferent to create new
          const editMode: boolean = (row.UUID)
          return (!field.isUpdateable && editMode) || (isUpdateableAllFields || field.isReadOnlyFromForm)
        } else if (this.panelType === 'browser') {
          // browser result
          return field.isReadOnly
        }
        // other type of panels (process/reports/forms)
        return isUpdateableAllFields
      }

      callOffNewRecord() {
        this.recordsData.shift()
      }

      tableRowClassName(params: { row: any, rowIndex: number }): 'warning-row' | '' {
        const { row, rowIndex } = params
        if (row.isNew && rowIndex === 0) {
          return 'warning-row'
        }
        return ''
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

          // eslint-disable-next-line
          //@ts-ignore
          this.multipleTable.$refs.bodyWrapper.scrollTop = 0
        } else {
          const fieldsEmpty: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
            containerUuid: this.containerUuid
          })
          this.$message({
            message: this.$t('notifications.mandatoryFieldMissing').toString() + fieldsEmpty,
            type: 'info'
          })
        }
      }

      async setFocus() {
        return new Promise(resolve => {
          const fieldFocus = this.fieldsList.find((itemField: IFieldDataExtendedUtils) => {
            if (Object.prototype.hasOwnProperty.call(this.$refs, itemField.columnName)) {
              if (fieldIsDisplayed(itemField) && !itemField.isReadOnly && itemField.isUpdateable) {
                return true
              }
            }
          })
          // eslint-disable-next-line
          // @ts-ignore
          this.$refs[fieldFocus.columnName][0].focusField()
          // resolve()
        })
      }

      /**
       * @param {object} field
       */
      cellClass(field: any): string {
        let classReturn = ''
        if (field.isReadOnly) {
          classReturn += ' cell-no-edit '
        }
        if (field.componentPath === 'FieldNumber') {
          classReturn += ' cell-align-right '
        }
        // return 'cell-edit'
        return classReturn
      }

      /**
       * Select or unselect rows
       * USE ONLY MOUNTED
       */
      toggleSelection(rows: any[]): void {
        if (rows) {
          rows.forEach((row: any) => {
            this.multipleTable!.toggleRowSelection(row)
          })
        } else {
          this.multipleTable!.clearSelection()
        }
      }

      confirmEdit(row: any): void {
        const fieldsEmpty: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
          containerUuid: this.containerUuid,
          row
        })

        if (row.isNew) {
          row.isEdit = true
          this.$message({
            message: this.$t('notifications.mandatoryFieldMissing').toString() + fieldsEmpty,
            type: 'info'
          })
          return
        }

        if (row.isEdit && fieldsEmpty) {
          row.isEdit = false
          this.$message({
            message: this.$t('notifications.mandatoryFieldMissing').toString() + fieldsEmpty,
            type: 'info'
          })
          return
        }
        row.isEdit = false
      }

      handleRowClick(row: any, column?: any, event?: any): void {
        this.currentTable = this.recordsData.findIndex(item => item.UUID === row.UUID)
        if (this.isShowedPanelRecord && this.isParent) {
          if (this.uuidCurrentRecordSelected !== row.UUID) {
            this.uuidCurrentRecordSelected = row.UUID
            // disabled rollback when change route
            this.$store.dispatch(Namespaces.Window + '/' + 'setDataLog', {})
          }
          const tableName: string = this.panelMetadata!.tableName
          // this.$router.push({
          //   name: this.$route.name!,
          //   query: {
          //     ...this.$route.query,
          //     action: row.UUID
          //   },
          //   params: {
          //     ...this.$router.params,
          //     tableName,
          //     recordId: row[`${tableName}_ID`]
          //   }
          // }, () => {})
          this.$store.commit('setCurrentRecord', row)
        } else {
          if (!row.isEdit) {
            row.isEdit = true
            /*
            const inSelection = this.getDataSelection.some(item => {
              return JSON.stringify(item) === JSON.stringify(row)
            })
            if (inSelection) {
              row.isEdit = true
            }
            */
          }
        }
      }

      handleRowDblClick(row: any, column: any, event: any) {
        if (!this.isShowedPanelRecord) {
          this.confirmEdit(row)
        }
      }

      handleSelection(rowsSelection: any, rowSelected: any) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'setSelection', {
          containerUuid: this.containerUuid,
          selection: rowsSelection
        })
      }

      handleSelectionAll(rowsSelection: any) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'setSelection', {
          containerUuid: this.containerUuid,
          selection: rowsSelection
        })
      }

      filterResult() {
        const data: any[] = this.recordsData.filter(rowItem => {
          if (this.searchTable.trim().length) {
            let find = false
            Object.keys(rowItem).forEach(key => {
              if (String(rowItem[key]).toLowerCase().includes(String(this.searchTable).toLowerCase())) {
                find = true
                return find
              }
            })
            return find
          }
          return true
        })
        return data
      }

      /**
       * Verify is displayed field in column table
       */
      isDisplayed(field: any): boolean {
        const isDisplayed: boolean = field.isDisplayed &&
          field.isDisplayedFromLogic &&
          field.isShowedTableFromUser &&
          !field.isKey
        //  Verify for displayed and is active
        return field.isActive && isDisplayed
      }

      /**
       * Get the tab object with all its attributes as well as the fields it contains
       */
      getPanel(): void {
        // get panel from server only window and tab children
        if (this.isPanelWindow && !this.isParent && !this.panelMetadata) {
          this.$store.dispatch(Namespaces.Panel + '/' + 'getPanelAndFields', {
            containerUuid: this.containerUuid,
            parentUuid: this.parentUuid,
            panelType: this.panelType
          }).catch(error => {
            console.warn(`Fields List Load Error ${error.code}: ${error.message}.`)
          })
        }
      }

      /**
       * @param {array} columns
       * @param {array} data
       */
      getSummaries(params: { columns: any[], data: any[] }) {
        const { columns, data } = params
        const sums: any[] = []
        if (!this.isShowedTotals) {
          return
        }

        const fieldsList = this.fieldsList
        columns.forEach((columnItem, index) => {
          if (index === 0) {
            sums[index] = 'Σ'
            return
          }
          const field = fieldsList.find(fieldItem => fieldItem.columnName === columnItem.property)
          const { displayType } = field!
          if (!FIELDS_QUANTITY.includes(displayType)) {
            sums[index] = ''
            return
          }
          const values = this.getDataSelection.map(item => Number(item[columnItem.property]))
          if (values.every(value => isNaN(value))) {
            sums[index] = 0
          } else {
            const total = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              }
              return prev
            }, 0)
            sums[index] = this.formatNumber({
              displayType,
              number: total
            })
          }
        })

        return sums
      }

      formatNumber(params: { displayType: any, number: number }): string {
        const { displayType, number } = params
        let fixed = 0
        // Amount, Costs+Prices, Number
        if (FIELDS_DECIMALS.includes(displayType)) {
          fixed = 2
        }
        return new Intl.NumberFormat().format(Number(number.toFixed(fixed)))
      }

      handleChangePage(newPage: number) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'setPageNumber', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          pageNumber: newPage,
          panelType: this.panelType
        })
      }

      click(): void {
        this.showTableSearch = !this.showTableSearch
        if (this.showTableSearch) {
          this.headerSearchInput && this.headerSearchInput.focus()
        }
      }

      getFieldDefinition(fieldDefinition: IFieldDefinitionData, row: any): string {
        let styleSheet = ''
        if (fieldDefinition && (fieldDefinition.id || fieldDefinition.conditions!.length)) {
          fieldDefinition.conditions!.forEach((condition: IFieldConditionData) => {
            const columns = evaluator.parseDepends(condition.condition!)
            let conditionLogic: string | undefined = condition.condition
            let conditionLogicResult = false
            columns.forEach(column => {
              conditionLogic = conditionLogic!.replace(/@/g, '')
              conditionLogic = conditionLogic.replace(column, row[column])
              conditionLogicResult = evaluator.evaluateLogic({
                logic: conditionLogic
              })
            })
            if (conditionLogicResult && condition.isActive) {
              styleSheet = condition.stylesheet!
            }
          })
        }
        return styleSheet
      }

      // Hooks
      created() {
        this.getPanel()
      }

      mounted() {
        if (this.isTableSelection) {
          this.toggleSelection(this.getDataSelection)
        }
      }
}
