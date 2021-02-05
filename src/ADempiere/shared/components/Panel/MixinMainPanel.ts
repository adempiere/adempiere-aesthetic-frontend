import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import { IRecordSelectionData } from '@/ADempiere/modules/persistence/PersistenceType'
import { AppModule, DeviceType } from '@/store/modules/app'
import { TagsViewModule } from '@/store/modules/tags-view'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { fieldIsDisplayed } from '../../utils/DictionaryUtils'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '../../utils/DictionaryUtils/type'
import { Namespaces } from '../../utils/types'
import { convertObjectToKeyValue } from '../../utils/valueFormat'
import { parsedValueComponent } from '../../utils/valueUtils'
import FieldDefinition from '../Field'
import FilterFields from './FilterFields'

@Component({
  name: 'MixinMainPanel',
  components: {
    FieldDefinition,
    FilterFields
  }
})
export default class MixinMainPanel extends Vue {
    @Prop() parentUuid?: string
    @Prop({ type: String, required: true }) containerUuid!: string
    @Prop({ type: Object, default: {} }) metadata: any
    @Prop({
      type: Object,
      default: () => ({
        groupType: '',
        grouName: ''
      })
    })
    groupTab!: {
      groupType: string
      groupName: string
    }

    @Prop({ type: String, default: 'window' }) panelType!: string

    @Prop({ type: Boolean, default: false }) isAdvancedQuery?: boolean
    @Prop({ type: Boolean, default: false }) isShowedRecordNavigation?: boolean
    public panelMetadata?: Partial<IPanelDataExtended> = {}
    public fieldsList: any[] = [] // groups list of fields
    public dataRecords: any = {}
    public isLoadPanel = false
    public isLoadRecord = false
    public uuidRecord = this.$route.query.action
    public fieldGroups: any[] = []
    public firstGroup: any = {}
    public groupsView = 0
    public tagTitle = {
      base: this.$route.meta.title,
      action: ''
    }

    // Computed properties
    get shadowGroup(): 'never' | 'hover' {
      if (this.isMobile) {
        return 'never'
      }
      return 'hover'
    }

    get optionCRUD(): string {
      return !this.uuidRecord ? 'create-new' : <string> this.uuidRecord
    }

    get isPanelWindow(): boolean {
      return this.panelType === 'window'
    }

    get panelAttributes() {
      return {
        recordUuid: <string> this.uuidRecord,
        optionCRUD: this.optionCRUD,
        isShowedRecordNavigation: this.isShowedRecordNavigation,
        isProcessingContext: this.getContainerProcessing,
        isProcessedContext: this.getContainerProcessed
      }
    }

    get getContainerProcessing(): boolean {
      if (
        this.panelType === PanelContextType.Window &&
            !this.isAdvancedQuery
      ) {
        return this.$store.getters[
          Namespaces.FieldValue + '/' + 'getContainerProcessing'
        ](this.parentUuid)
      }
      return false
    }

    get getContainerProcessed(): boolean {
      if (
        this.panelType === PanelContextType.Window &&
            !this.isAdvancedQuery
      ) {
        return this.$store.getters[
          Namespaces.FieldValue + '/' + 'getContainerProcessed'
        ](this.parentUuid)
      }
      return false
    }

    get getterPanel(): IPanelDataExtended | undefined {
      return this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](
        this.containerUuid
      )
    }

    get getterFieldsList(): IFieldDataExtendedUtils[] | undefined {
      let panel = this.panelMetadata
      if (panel && panel.fieldsList) {
        return panel.fieldsList
      }
      panel = this.getterPanel
      if (panel) {
        return panel.fieldsList
      }
      return undefined
    }

    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    get getterDataStore():
        | IRecordSelectionData
        | {
              recordCount: number
              isLoaded: boolean
              record: any[]
              } {
      if (this.isPanelWindow) {
        return this.$store.getters[
          Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'
        ](this.containerUuid)
      }
      return {
        recordCount: 0,
        isLoaded: false,
        record: []
      }
    }

    get getterIsLoadedRecord(): boolean {
      return this.getterDataStore.isLoaded
    }

    get classCards(): 'cards-not-group' | 'cards-in-group' {
      if (
        this.isMobile ||
            this.fieldGroups.length < 2 ||
            this.isShowedRecordNavigation
      ) {
        return 'cards-not-group'
      }
      return 'cards-in-group'
    }

    // Watchers
    // used only panel modal (process associated in browser or window)
    @Watch('containerUuid')
    handleContainerUuidChange() {
      if (['report', 'process'].includes(this.panelType)) {
        this.generatePanel(this.metadata.fieldsList)
      }
    }

    @Watch('$route.query.action')
    hanldeQueryActionRouteChange(newValue: any, oldValue: any) {
      // used in field, if uuid record or different create-new, field is read only
      this.uuidRecord = newValue

      if (newValue !== oldValue && this.isPanelWindow) {
        this.changePanelRecord(newValue)
      }
    }

    @Watch('isLoadPanel')
    hanldeIsLoadPanelChange(value: any) {
      if (value) {
        this.readParameters()
      }
    }

    // Methods
    /**
     * Get the tab object with all its attributes as well as the fields it contains
     */
    getPanel(): void {
      const panel: IPanelDataExtended | undefined = this.getterPanel
      if (panel && panel.fieldsList) {
        this.panelMetadata = panel
        const fieldsList = panel.fieldsList
        if (fieldsList && Array.isArray(fieldsList)) {
          this.generatePanel(fieldsList)
        }
      } else {
        this.$store
          .dispatch(Namespaces.Panel + '/' + 'getPanelAndFields', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            panelType: this.panelType,
            tabMetadata: this.metadata,
            isAdvancedQuery: this.isAdvancedQuery
          })
          .then(panelResponse => {
            this.panelMetadata = panelResponse
            this.generatePanel(panelResponse.fieldsList)
          })
          .catch(error => {
            console.warn(
                        `Field Load Error: ${error.message}. Code: ${error.code}.`
            )
          })
      }
    }

    generatePanel(fieldsList: any[]): void {
      // order and assign groups
      this.fieldsList = fieldsList
      if (fieldsList.length) {
        this.fieldGroups = this.sortAndGroup(fieldsList)!
      }
      let firstGroup
      if (this.fieldGroups[0] && this.fieldGroups[0].groupFinal === '') {
        firstGroup = this.fieldGroups[0]
        this.fieldGroups.shift()
      }
      this.firstGroup = firstGroup
      this.isLoadPanel = true
    }

    /**
     * TODO: Delete route parameters after reading them
     */
    readParameters(): void {
      const parameters: {
        isLoadAllRecords: boolean
        isReference: boolean
        isNewRecord: boolean
        isWindow: boolean
        criteria: any
        referenceUuid?: string
        referenceWhereClause?: string
        value?: any
        tableName?: string
        columnName?: string
      } = {
        isLoadAllRecords: true,
        isReference: false,
        isNewRecord: false,
        isWindow: true,
        criteria: {}
      }
      const route = this.$route
      if (this.isPanelWindow) {
            // TODO: use action notifyPanelChange with isShowedField in true
            this.getterFieldsList!.forEach(fieldItem => {
              const {
                columnName,
                componentPath,
                displayType,
                isAdvancedQuery,
                isMandatory
              } = fieldItem
              if (
                Object.prototype.hasOwnProperty.call(
                  route.query,
                  columnName
                ) &&
                    !isAdvancedQuery
              ) {
                fieldItem.isShowedFromUser = true
                fieldItem.value = parsedValueComponent({
                  columnName,
                  componentPath: componentPath!,
                  displayType,
                  isMandatory,
                  value: route.query[columnName]
                })
                if (
                  String(route.query.isAdvancedQuery) ===
                        String(isAdvancedQuery)
                ) {
                  fieldItem.value = parsedValueComponent({
                    columnName,
                    componentPath: componentPath!,
                    displayType,
                    value: route.query[columnName]
                  })
                  if (
                    fieldItem.isRange &&
                            this.$route.query[`${columnName}_To`]
                  ) {
                    fieldItem.valueTo = parsedValueComponent({
                      columnName,
                      componentPath: componentPath!,
                      displayType,
                      value: route.query[`${columnName}_To`]
                    })
                  }
                }
              }
            })

            if (route.query.action && route.query.action === 'reference') {
              const referenceInfo = this.$store.getters.getReferencesInfo({
                windowUuid: this.parentUuid,
                recordUuid: route.query.recordUuid,
                referenceUuid: route.query.referenceUuid
              })
              route.params.isReadParameters = 'true'
              parameters.isLoadAllRecords = false
              parameters.isReference = true
              parameters.referenceUuid = referenceInfo.uuid
              parameters.referenceWhereClause = referenceInfo.whereClause
            } else if (
              route.query.action &&
                route.query.action === 'create-new'
            ) {
              parameters.isNewRecord = true
            } else if (
              route.query.action &&
                route.query.action === 'criteria'
            ) {
              route.params.isReadParameters = 'true'
              Object.keys(route.params).forEach(param => {
                if (route.params[param]) {
                  parameters.criteria[param] = route.params[param]
                }
              })
            } else if (
              route.query.action &&
                route.query.action === 'listRecords'
            ) {
              parameters.isLoadAllRecords = true
              route.params.isReadParameters = 'true'
            } else if (
              route.query.action &&
                ![
                  'create-new',
                  'reference',
                  'advancedQuery',
                  'criteria',
                  'listRecords'
                ].includes(<string>route.query.action)
            ) {
              parameters.isLoadAllRecords = false
              parameters.value = route.query.action
              parameters.tableName = this.metadata.tableName
              parameters.columnName = 'UUID'
              route.params.isReadParameters = 'true'
            }
            // Only call get data if panel type is window
            if (
              !Object.prototype.hasOwnProperty.call(
                route.params,
                'isReadParameters'
              ) ||
                route.params.isReadParameters
            ) {
              this.getData(parameters)
            }
            let viewTitle = ''
            if (route.query && route.query.action) {
              viewTitle = <string>route.query.action
            }
            this.setTagsViewTitle(viewTitle)
      } else {
        if (
          this.panelType === PanelContextType.Table &&
                route.query.action === 'advancedQuery'
        ) {
          // TODO: use action notifyPanelChange with isShowedField in true
          this.fieldsList.forEach(fieldItem => {
            const {
              columnName,
              componentPath,
              displayType,
              isAdvancedQuery
            } = fieldItem

            if (
              Object.prototype.hasOwnProperty.call(
                route.query,
                columnName
              ) &&
                        isAdvancedQuery
            ) {
              fieldItem.isShowedFromUser = true

              if (
                route.query.action === 'advancedQuery' &&
                            isAdvancedQuery
              ) {
                this.dataRecords[columnName] = parsedValueComponent(
                  {
                    columnName,
                    componentPath,
                    displayType,
                    value: route.query[columnName]
                  }
                )
                if (
                  fieldItem.isRange &&
                                route.query[`${columnName}_To`]
                ) {
                  this.dataRecords[
                    columnName
                  ] = parsedValueComponent({
                    columnName,
                    componentPath,
                    displayType,
                    value: route.query[`${columnName}_To`]
                  })
                }
              }
            }
          })
          parameters.isWindow = false
          this.$store.dispatch(Namespaces.Panel + '/' + 'notifyPanelChange', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            attributes: {
              isAdvancedQuery: route.query.action === 'advancedQuery',
              newValues: this.dataRecords,
              isSendToServer: true,
              isSendCallout: false,
              fieldsList: this.fieldsList,
              panelType: this.panelType
            }
          })
        } else if (['process', 'browser'].includes(this.panelType)) {
          if (route.query) {
            this.$store.dispatch(Namespaces.Panel + '/' + 'notifyPanelChange', {
              containerUuid: this.containerUuid,
              attributes: {
                newValues: route.query,
                isShowedField: true,
                isSendCallout: false,
                panelType: this.panelType
              }
            })
            parameters.isWindow = false
          }
        }
      }
    }

    /**
     * @param  {object} parameters parameters to condition the data query
     */
    getData(parameters: any): void {
      if (
        parameters.isWindow &&
            this.isPanelWindow &&
            !this.getterIsLoadedRecord
      ) {
        this.$store
          .dispatch(Namespaces.Window + '/' + 'getDataListTab', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            isLoadAllRecords: parameters.isLoadAllRecords,
            isReference: parameters.isReference,
            referenceWhereClause: parameters.referenceWhereClause,
            columnName: parameters.columnName,
            value: parameters.value,
            criteria: parameters.criteria
          })
          .then(response => {
            let action = 'create-new'
            let params = this.$route.params
            if (response && response.length && !parameters.isNewRecord) {
              this.dataRecords = response[0]
              const recordId = this.dataRecords[
                            `${this.metadata.tableName}_ID`
              ]
              params = {
                ...params,
                tableName: this.metadata.tableName,
                recordId
              }
              if (this.$route.query.action === 'reference') {
                action = 'reference'
              } else {
                // 'criteria'
                action = this.dataRecords.UUID
              }
              let viewTitle = ''
              if (this.$route.query && this.$route.query.action) {
                viewTitle = <string> this.$route.query.action
              }
              this.setTagsViewTitle(viewTitle)
              this.isLoadRecord = true
            }

            this.$router.push(
              {
                name: this.$route.name!,
                params,
                query: {
                  ...this.$route.query,
                  action
                }
              }
            )

            if (action === 'create-new') {
              this.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
                panelType: this.panelType,
                parentUuid: this.parentUuid,
                containerUuid: this.containerUuid,
                isNewRecord: true
              })
            } else {
              const attributes = convertObjectToKeyValue({
                object: this.dataRecords
              })
              this.$store.dispatch(Namespaces.Panel + '/' + 'notifyPanelChange', {
                parentUuid: this.parentUuid,
                containerUuid: this.containerUuid,
                attributes
              })
            }
          })
          .catch(error => {
            console.warn(
                        `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
            )
          })
      }
    }

    /**
     * Group the arrangement into groups of columns that they contain, it must
     * be grouped after having the order
     * @param {array} fieldsList
     * @return {array} groupsList
     * TODO: Save into store to dont regenerate
     */

    sortAndGroup(fieldsList: any[]) {
      if (!fieldsList) {
        return
      }
      let groupsList: {
            groupFinal: string
            metadataFields?: any[]
            typeGroup?: string
            activeFields?: number
        }[] = [
          {
            groupFinal: '',
            metadataFields: fieldsList
          }
        ]

      // reduce, create array with number groupAssigned element comun
      if (this.isPanelWindow) {
        groupsList = fieldsList
          .reduce((groupsList, currentValue) => {
            if (!groupsList.includes(currentValue.groupAssigned)) {
              groupsList.push(currentValue.groupAssigned)
            }
            return groupsList
          }, [])
          .map((itemGroup: any) => {
            return {
              groupFinal: itemGroup,
              metadataFields: fieldsList.filter(itemField => {
                return itemField.groupAssigned === itemGroup
              })
            }
          })
      }

      // count and add the field numbers according to your group
      groupsList.forEach(groupFields => {
        const typeG = groupFields.metadataFields![0].typeGroupAssigned
        groupFields.typeGroup = typeG

        const fieldsDisplayed = groupFields.metadataFields!.filter(
          field => {
            return fieldIsDisplayed(field)
          }
        )

        if (
          (this.groupTab.groupType === 'T' &&
                    this.groupTab.groupName === groupFields.groupFinal) ||
                (this.groupTab.groupType !== 'T' &&
                    groupFields.typeGroup !== 'T')
        ) {
          this.groupsView = this.groupsView + 1
        }
        groupFields.activeFields = fieldsDisplayed.length
      })

      return groupsList
    }

    /**
     * Set title in tag view
     * @param {string} actionValue
     */
    setTagsViewTitle(actionValue: string) {
      if (
        actionValue !== 'create-new' &&
            actionValue &&
            this.panelMetadata!.isDocument &&
            this.getterDataStore.isLoaded
      ) {
        this.$store.dispatch(Namespaces.ContainerInfo + '/' + 'listWorkflows', this.metadata.tableName)
        this.$store.dispatch(Namespaces.ContextMenu + '/' + 'listDocumentStatus', {
          recordUuid: this.$route.query.action,
          tableName: this.metadata.tableName
        })
      }
      if (actionValue === 'create-new' || !actionValue) {
        this.tagTitle.action = this.$t('tagsView.newRecord').toString()
      } else if (actionValue === 'advancedQuery') {
        this.tagTitle.action = this.$t('tagsView.advancedQuery').toString()
      } else {
        const { identifierColumns } = this.panelMetadata!
        if (identifierColumns) {
          const keyName: string = identifierColumns[0].columnName
          if (this.dataRecords[keyName]) {
            this.tagTitle.action = this.dataRecords[keyName]
          } else {
            const field = this.fieldsList.find(
              fieldItem => fieldItem.isIdentifier
            )
            const value = this.$store.getters[
              Namespaces.FieldValue + '/' + 'getValueOfField'
            ]({
              parentUuid: this.parentUuid,
              containerUuid: this.containerUuid,
              columnName: field.columnName
            })
            this.tagTitle.action = value
          }
        } else {
          this.tagTitle.action = this.$t('tagsView.seeRecord').toString()
        }
      }
      if (this.isPanelWindow) {
        TagsViewModule.updateVisitedView({
          ...this.$route,
          title: `${this.tagTitle.base} - ${this.tagTitle.action}`
        })
      }
    }

    changePanelRecord(uuidRecord: string): void {
      if (
        ![
          'create-new',
          'reference',
          'advancedQuery',
          'criteria',
          'listRecords'
        ].includes(uuidRecord)
      ) {
        this.$store
          .dispatch(Namespaces.Panel + '/' + 'seekRecord', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: uuidRecord
          })
          .then(() => {
            if (this.panelMetadata!.isTabsChildren) {
              // delete records tabs children when change record uuid
              this.$store.dispatch(Namespaces.BusinessData + '/' + 'deleteRecordContainer', {
                viewUuid: this.parentUuid,
                withOut: [this.containerUuid]
              })
            }
          })
      }

      const currentRecord =
            this.getterDataStore.record.find(
              record => record.UUID === uuidRecord
            ) || {}
      this.dataRecords = currentRecord
      this.$store.commit(Namespaces.Window + '/' + 'setCurrentRecord', currentRecord)

      this.setTagsViewTitle(uuidRecord)
      if (this.$route.query && this.$route.query.action === 'create-new') {
        this.setFocus()
      }
    }

    async setFocus() {
      return new Promise(resolve => {
        const fieldFocus = this.getterFieldsList!.find(itemField => {
          if (itemField.handleRequestFocus) {
            return true
          }
          if (
            Object.prototype.hasOwnProperty.call(
              this.$refs,
              itemField.columnName
            )
          ) {
            if (
              fieldIsDisplayed(itemField) &&
                        !itemField.isReadOnly &&
                        itemField.isUpdateable &&
                        itemField.componentPath !== 'FieldSelect'
            ) {
              return true
            }
          }
        })
        if (fieldFocus) {
          // eslint-disable-next-line
          // @ts-ignore
          this.$refs[fieldFocus.columnName][0].focusField()
        }
      })
    }

    // Hooks
    created() {
      // get fields with uuid
      this.getPanel()
    }
}
