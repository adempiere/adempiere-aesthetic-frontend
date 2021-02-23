import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { IRecordSelectionData } from '@/ADempiere/modules/persistence/PersistenceType'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'MixinTable'
})
export default class MixinTable extends Vue {
    @Prop({ type: String, default: undefined }) parentUuid?: string
    @Prop({ type: String, required: true }) containerUuid!: string
    @Prop({ type: String, default: 'window' }) panelType?: PanelContextType
    @Prop({ type: Boolean, default: false }) isParent!: boolean
    // eslint-disable-next-line
    // @Prop({ type: Object, default: () => {} }) panelMetadata?: any

    // private panelMetadata: any = () => undefined

    // Computed properties
    get panelMetadata(): any {
      return this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](this.containerUuid)
    }

    set panelMetadata(value: any) {
      this.panelMetadata = value
    }

    get isMobile(): boolean {
      return this.$store.state.app.device === DeviceType.Mobile
    }

    get isCreateNewRoute(): boolean {
      return this.$route.query.action === 'create-new'
    }

    get isPanelWindow(): boolean {
      return Boolean(this.panelType === PanelContextType.Window)
    }

    get isReadOnlyParent(): boolean {
      if (this.isPanelWindow) {
        if (
          !this.$store.getters[Namespaces.FieldValue + '/' + 'getContainerIsActive'](this.parentUuid)
        ) {
          return true
        }
        if (
          this.$store.getters[
            Namespaces.FieldValue + '/' + 'getContainerProcessing'
          ](this.parentUuid)
        ) {
          return true
        }
        if (
          this.$store.getters[
            Namespaces.FieldValue + '/' + 'getContainerProcessed'
          ](this.parentUuid)
        ) {
          return true
        }
      }
      return false
    }

    get isDisabledAddNew(): boolean {
      if (this.isParent) {
        return true
      }
      if (this.isCreateNewRoute) {
        return true
      }
      const panelMetadata = this.panelMetadata
      if (panelMetadata && !panelMetadata.isInsertRecord) {
        return true
      }
      if (this.isReadOnlyParent) {
        return true
      }
      if (this.newRecordsQuantity) {
        return true
      }
      return false
    }

    // records, selection, record count
    get getterDataRecordsAndSelection(): IRecordSelectionData {
      return this.$store.getters[
        Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'
      ](this.containerUuid)
    }

    get recordsData(): any[] {
      return this.getterDataRecordsAndSelection.record
    }

    get getDataSelection(): any[] {
      return this.getterDataRecordsAndSelection.selection
    }

    get newRecordsQuantity(): number {
      if (this.isPanelWindow && !this.isParent) {
        const newRecordTable: any[] = this.getterDataRecordsAndSelection.record.filter(
          (recordItem: any) => {
            return recordItem.isNew
          }
        )
        return newRecordTable.length
      }
      return 0
    }

    // Methods
    closeMenu(): void {
      // TODO: Validate to dispatch one action
      this.$store.dispatch('showMenuTable', {
        isShowedTable: false
      })
      this.$store.dispatch('showMenuTabChildren', {
        isShowedTabChildren: false
      })
    }

    deleteSelection(): void {
      this.$store.dispatch('deleteSelectionDataList', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid
      })
        .then(() => {
          this.$store.dispatch('setRecordSelection', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            panelType: this.panelType
          })
        })
    }
}
