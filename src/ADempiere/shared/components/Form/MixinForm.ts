import { Component, Prop, Vue } from 'vue-property-decorator'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '../../utils/types'
import { createFieldFromDefinition, createFieldFromDictionary, IFieldTemplateData, IOverwriteDefinitionData } from '@/ADempiere/shared/utils/lookupFactory'
import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import { IFieldLocation } from '../Field/FieldLocation/fieldList'
import Field from '@/ADempiere/shared/components/Field'

@Component({
  name: 'MixinForm',
  components: {
    Field,
    FieldDefinition: Field
  }
})
export default class MixinForm extends Vue {
    @Prop({ type: Object, default: undefined }) metadata?: any
    public formUuid: string = this.$route.meta.uuid
    // eslint-disable-next-line
    // @ts-ignore
    public containerUuid: string = this.metadata.containerUuid || this.$route.meta.uuid || this.metadata.uuid
    public fieldList: any[] = []
    public panelMetadata: any = {}
    public isLoaded = false
    public isCustomForm = false
    public unsubscribe: Function = () => undefined
    public panelType: PanelContextType = PanelContextType.Form

    // Computed properties

    get getterPanel() {
      return this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](this.containerUuid)
    }

    // Methods

    createFieldFromDefinition = createFieldFromDefinition
    createFieldFromDictionary = createFieldFromDictionary
    /**
     * Using forms and events with the enter key prevents the page from reloading
     * with @submit.native.prevent="notSubmitForm" in el-form component
     */
    notSubmitForm(event: Event): boolean {
      event.preventDefault()
      return false
    }

    async getPanel() {
      const panel = this.getterPanel
      if (panel) {
        this.fieldList = panel.fieldsList
        this.isLoaded = true
        this.panelMetadata = panel
      } else {
        await this.generateFieldsList()
        console.log('getPanel MixinForm')
        console.log(...this.metadata)
        this.$store.dispatch(Namespaces.Panel + '/' + 'addPanel', {
          ...this.metadata,
          isCustomForm: this.isCustomForm,
          uuid: this.containerUuid,
          panelType: this.panelType,
          fieldsList: this.fieldList
        })
          .then((responsePanel: IPanelDataExtended) => {
            this.fieldList = responsePanel.fieldsList

            this.$store.dispatch('changeFormAttribute', {
              containerUuid: this.containerUuid,
              attributeName: 'fieldsList',
              attributeValue: this.fieldList
            })
            this.panelMetadata = responsePanel
            this.runAfterLoadPanel()
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    }

    runAfterLoadPanel() {
      // some actions after load form panel
    }

    generateFieldsList() {
      let sequence = 0
      const incrementSequence = (newValue?: number): number => {
        if (newValue) {
          sequence = newValue
        }
        sequence = sequence + 10
        return sequence
      }

      if (this.metadata) {
        return new Promise(resolve => {
          const additionalAttributes = {
            containerUuid: this.containerUuid,
            isEvaluateValueChanges: false,
            panelType: this.panelType
          }

          const fieldsListFromDictionary: IFieldTemplateData[] = []
          const fieldsListFromMetadata: IFieldTemplateData[] = []

          this.fieldList.forEach((fieldElement: IFieldLocation) => {
            if (fieldElement.isFromDictionary) {
              // set sequence
              if (fieldElement.overwriteDefinition) {
                if (!fieldElement.overwriteDefinition.sequence) {
                  fieldElement.overwriteDefinition.sequence = incrementSequence()
                } else {
                  incrementSequence(fieldElement.overwriteDefinition.sequence)
                }
              } else {
                fieldElement.overwriteDefinition = {
                  index: 0,
                  size: 0
                }
                fieldElement.overwriteDefinition.sequence = incrementSequence()
              }

              this.createFieldFromDictionary({
                columnName: fieldElement.columnName!,
                containerUuid: additionalAttributes.containerUuid,
                overwriteDefinition: <IOverwriteDefinitionData>fieldElement.overwriteDefinition,
                tableName: fieldElement.tableName!
              }).then((result: IFieldTemplateData) => {
                fieldsListFromDictionary.push(result)
              })
            } else {
              // set sequence
              if (fieldElement.overwriteDefinition) {
                if (!fieldElement.overwriteDefinition.sequence) {
                  fieldElement.overwriteDefinition.sequence = incrementSequence()
                } else {
                  incrementSequence(fieldElement.overwriteDefinition.sequence)
                }
              } else {
                fieldElement.overwriteDefinition = {}
                fieldElement.overwriteDefinition.sequence = incrementSequence()
              }

              fieldsListFromMetadata.push(
                this.createFieldFromDefinition({
                  columnName: fieldElement.columnName!,
                  containerUuid: additionalAttributes.containerUuid,
                  panelType: additionalAttributes.panelType,
                  definition: fieldElement.overwriteDefinition
                //   ...fieldElement,
                //   ...additionalAttributes
                })
              )
            }
          })
          let fieldsList: IFieldTemplateData[] = fieldsListFromMetadata

          if (!fieldsListFromDictionary) {
            this.fieldList = fieldsList
            resolve(fieldsList)
            this.isLoaded = true
          } else {
            Promise.all(fieldsListFromDictionary)
              .then(responsefields => {
                fieldsList = fieldsList.concat(responsefields)
                resolve(fieldsList)
                this.fieldList = fieldsList
                this.isLoaded = true
              })
          }
        })
      }
    }

    // // Set value for one field from panel
    // // use example: setValue('ProductName', 'Patio Fun')
    // setValue(columnName: string, value: any) {
    //   // this.$store.dispatch('notifyFieldChange', {
    //   //   containerUuid: this.metadata.containerUuid,
    //   //   panelType: this.metadata.panelType,
    //   //   columnName,
    //   //   newValue: value
    //   // })
    // }

    //  Set values for all list of columns
    // Use example: setValues(values)
    setValues(params: { values?: any, withOutColumnNames?: string[] }) {
      const { values = {}, withOutColumnNames = [] } = params
      this.$store.dispatch('notifyPanelChange', {
        containerUuid: this.containerUuid,
        panelType: this.metadata.panelType,
        attributes: values,
        withOutColumnNames,
        isChangedAllValues: true
      })
    }

    addAction(action: any) {
      this.$store.dispatch('addAction', {
        name: action.name,
        action: action.action,
        containerUuid: this.containerUuid
      })
    }

    // Hooks
    created() {
      this.getPanel()
    }
}
