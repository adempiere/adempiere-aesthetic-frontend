import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import {
  IDocumentActionData,
  IListDocumentAction,
  IListDocumentStatus
} from '@/ADempiere/modules/window'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IFieldDataExtendedUtils } from '../../utils/DictionaryUtils/type'
import { Namespaces } from '../../utils/types'
import { tagStatus } from '../../utils/valueUtils'
import Template from './template.vue'

@Component({
  name: 'WorkflowStatusBar',
  mixins: [Template]
})
export default class WorkflowStatusBar extends Vue {
    @Prop({ type: Object, default: {} }) styleSteps: any
    @Prop({ type: String, default: '' }) parentUuid!: string
    @Prop({ type: String, default: '' }) containerUuid!: string
    @Prop({ type: String, default: 'window' }) panelType!: string
    public currentKey = 100
    public typeAction = 0
    public chatNote = ''
    public columnName = 'DocStatus'
    public displayColumnName = 'DisplayColumn_DocStatus'
    public documentStatusesList: any[] = []

    // Computed properties
    get value(): any {
      return this.$store.getters[
        Namespaces.FieldValue + '/' + 'getValueOfField'
      ]({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        columnName: this.columnName
      })
    }

    set value(value: any) {
      this.$store.commit('updateValueOfField', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        columnName: this.columnName,
        value
      })
    }

    get displayedValue(): any {
      return this.$store.getters[
        Namespaces.FieldValue + '/' + 'getValueOfField'
      ]({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: this.displayColumnName
      })
    }

    get fieldDocStatus(): IFieldDataExtendedUtils | undefined {
      const panel: IPanelDataExtended | undefined = this.$store.getters[
        Namespaces.Panel + '/' + 'getPanel'
      ](this.containerUuid)
      if (panel) {
        const field:
                | IFieldDataExtendedUtils
                | undefined = panel.fieldsList.find(fieldItem => {
                  return fieldItem.columnName === this.columnName
                })
        return field
      }
      return undefined
    }

    get getActive(): any {
      const valueStatus: any = this.value
      return this.listDocumentStatus.findIndex(
        (index: any) => index.value === valueStatus
      )
    }

    get listDocumentStatus(): IDocumentActionData[] {
      const documentStatus: IListDocumentStatus = this.$store.getters[
        Namespaces.ContextMenu + '/' + 'getListDocumentStatus'
      ]
      return documentStatus.documentActionsList
    }

    get documentActions(): IListDocumentAction {
      return this.$store.getters[
        Namespaces.ContextMenu + '/' + 'getListDocumentActions'
      ]
    }

    get listDocumentActions(): IDocumentActionData[] {
      // TODO: Add current value in disabled
      return this.documentActions.documentActionsList
    }

    get infoDocumentAction(): IDocumentActionData | any {
      const value = this.value
      const found:
            | IDocumentActionData
            | undefined = this.listDocumentActions.find(
              (element: IDocumentActionData) => {
                return element.value === value
              }
            )

      if (!found) {
        return value
      }
      return found
    }

    get processOrderUuid(): any[] | string {
      return this.$store.getters[Namespaces.Utils + '/' + 'getOrders']
    }

    // Methods
    listActionDocument(isShowList: boolean) {
      if (isShowList) {
        // if (!this.withoutRecord && this.$route.query.action !== this.documentActions.recordUuid) {
        if (this.$route.query.action !== this.documentActions.recordUuid) {
          this.$store.dispatch('listDocumentActionStatus', {
            recordUuid: this.$route.query.action,
            tableName: this.$route.params.tableName,
            recordId: this.$route.params.recordId
          })
        }
      }
    }

    tagStatus = tagStatus

    documentActionChange(value: any) {
      // this.$store.dispatch('notifyFieldChange', {
      //   parentUuid: this.parentUuid,
      //   containerUuid: this.containerUuid,
      //   columnName: 'DocAction',
      //   isSendToServer: true,
      //   newValue: value
      // })
      //   .then(response => {
      //     const actionProcess = this.$store.getters.getOrders
      //     this.$store.dispatch('startProcess', {
      //       action: {
      //         uuid: actionProcess.uuid,
      //         id: actionProcess.id,
      //         name: actionProcess.name
      //       }, // process metadata
      //       tableName: this.$route.params.tableName,
      //       recordId: this.$route.params.recordId,
      //       recordUuid: this.$route.query.action,
      //       parametersList: [{
      //         columnName: 'DocAction',
      //         value: this.value
      //       }],
      //       isActionDocument: true,
      //       parentUuid: this.parentUuid,
      //       panelType: this.panelType,
      //       containerUuid: this.containerUuid// determinate if get table name and record id (window) or selection (browser)
      //     })
      //     this.value = ''
      //   })
    }
}
