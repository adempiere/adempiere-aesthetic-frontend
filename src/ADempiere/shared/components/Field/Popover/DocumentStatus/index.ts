import { IDocumentActionData } from '@/ADempiere/modules/window'
import { IListDocumentAction } from '@/ADempiere/modules/window/WindowType/VuexType'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'FieldDocumentStatus',
  mixins: [Template]
})
export default class FieldDocumentStatus extends Vue {
    @Prop({ type: Object, required: true }) field!: any
    public valueActionDocument = ''

    // Computed properties
    get withoutRecord(): boolean {
      // TODO: Validate with record attribute
      if (!this.$route.query.action ||
        ['create-new', 'reference', 'advancedQuery', 'criteria'].includes(String(this.$route.query.action))) {
        return true
      }
      return false
    }

    get documentActions(): IListDocumentAction {
      return this.$store.getters[Namespaces.ContextMenu + '/' + 'getListDocumentActions']
    }

    get listDocumentActions(): IDocumentActionData[] {
      return this.documentActions.documentActionsList
    }

    get labelDocumentActions(): string {
      const found: IDocumentActionData | undefined = this.listDocumentActions.find((element: IDocumentActionData) => {
        if (element.value === this.valueActionDocument) {
          return element
        }
      })
      if (!found) {
        return this.valueActionDocument
      }
      return found.name
    }

    get descriptionDocumentActions(): string | undefined {
      const found: IDocumentActionData | undefined = this.listDocumentActions.find((element: IDocumentActionData) => {
        if (element.value === this.valueActionDocument) {
          return element
        }
      })
      if (isEmptyValue(found)) {
        return this.valueActionDocument
      }
      return found!.description
    }

    get processOrderUuid(): any[] {
      return this.$store.getters[Namespaces.Utils + 'getOrders']
    }

    // Methods
    listActionDocument(isShowList: boolean): void {
      if (isShowList) {
        if (!this.withoutRecord && this.$route.query.action !== this.documentActions.recordUuid) {
          this.$store.dispatch(Namespaces.ContextMenu + '/' + 'listDocumentActionStatus', {
            recordUuid: this.$route.query.action,
            tableName: this.$route.params.tableName,
            recordId: this.$route.params.recordId
          })
        }
      }
    }

    documentActionChange(value: any): void {
      // this.$store.dispatch('notifyFieldChange', {
      //   parentUuid: this.field.parentUuid,
      //   containerUuid: this.field.containerUuid,
      //   columnName: 'DocAction',
      //   isSendToServer: true,
      //   newValue: value
      // })

      const actionProcess = this.$store.getters[Namespaces.Utils + '/' + 'getOrders']
      this.$store.dispatch(Namespaces.Process + '/' + 'startProcess', {
        action: {
          uuid: actionProcess.uuid,
          id: actionProcess.id,
          name: actionProcess.name
        }, // process metadata
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId,
        recordUuid: this.$route.query.action,
        parametersList: [{
          columnName: this.field.columnName,
          value: this.valueActionDocument
        }],
        isActionDocument: true,
        parentUuid: this.field.parentUuid,
        panelType: <PanelContextType> this.field.panelType,
        containerUuid: this.field.containerUuid // determinate if get table name and record id (window) or selection (browser)
      })
      this.valueActionDocument = ''
    }
}
