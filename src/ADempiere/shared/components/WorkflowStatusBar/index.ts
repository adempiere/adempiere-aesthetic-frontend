import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import {
  IDocumentActionData,
  IListDocumentAction,
  IListDocumentStatus
} from '@/ADempiere/modules/window'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IFieldDataExtendedUtils } from '../../utils/DictionaryUtils/type'
import { Namespaces } from '../../utils/types'
import Template from './template.vue'

@Component({
  name: 'WorkflowStatusBar',
  mixins: [Template]
})
export default class WorkflowStatusBar extends Vue {
    @Prop({ type: Object, default: {} }) styleSteps: any = {}
    @Prop({ type: String, default: '' }) parentUuid = ''
    @Prop({ type: String, default: '' }) containerUuid = ''
    @Prop({ type: String, default: 'window' }) panelType = 'window'
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
}
