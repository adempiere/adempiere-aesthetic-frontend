import { ILookupOptions } from '@/ADempiere/modules/ui/UITypes'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { convertBooleanToString } from '@/ADempiere/shared/utils/valueFormat'
import { ElMessageOptions } from 'element-ui/types/message'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldAutocomplete',
  mixins: [Template, MixinField]
})
export class FieldAutocomplete extends Mixins(MixinField) {
    public label = ''
    public blankOption: Partial<ILookupOptions> = {
      label: this.label,
      id: undefined,
      uuid: undefined
    }

    public controlDisplayed?: any
    public isFocus = false
    public isLoading = false
    public optionsList: any[] = [this.blankOption]
    public blankValues: any[] = [null, undefined, -1]
    public timeOut: any = null

    // Computed properties
    isPanelWindow(): boolean {
      return this.metadata.panelType === PanelContextType.Window
    }

    get isSelectMultiple(): boolean {
      return ['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery
    }

    get cssClassStyle(): string {
      let styleClass = this.metadata.cssClassName + ' custom-field-select'
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple'
      }
      return styleClass
    }

    get placeholder(): any {
      if (this.isFocus) {
        return this.displayedValue
      }
      return this.$t('quickAccess.searchWithEnter').toString()
    }

    get getterLookupList(): ILookupOptions[] {
      if (!(this.metadata.reference.query) ||
          !this.metadata.displayed) {
        return [<ILookupOptions> this.blankOption]
      }
      return this.$store.getters[Namespaces.Lookup + '/' + 'getLookupList']({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.reference.query,
        tableName: this.metadata.reference.tableName
      })
    }

    get getterLookupAll(): ILookupOptions[] {
      const allOptions: ILookupOptions[] = this.$store.getters[Namespaces.Lookup + '/' + 'getLookupAll']({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.reference.query,
        directQuery: this.metadata.reference.directQuery,
        tableName: this.metadata.reference.tableName,
        value: this.value
      })

      // sets the value to blank when the lookupList or lookupItem have no
      // values, or if only lookupItem does have a value
      if (!allOptions || (allOptions.length &&
          (!this.blankValues.includes(allOptions[0].id)))) {
        allOptions.unshift(<ILookupOptions> this.blankOption)
      }
      return allOptions
    }

    get value(): any {
      const value = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName
      })
      if (!value) {
        /* eslint-disable */
            this.displayedValue = undefined
            /* eslint-disable */
            return value
          }
  
          let label = value.label || this.label
          if (!label) {
            label = this.displayedValue
            /* eslint-disable */
            this.optionsList.push({
              // TODO: Add uuid
              id: value,
              label
            })
            /* eslint-disable */
          }
          return value
    }

    set value(value: any){
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            columnName: this.metadata.columnName,
            value
          })
    }

    get displayedValue(): any {
        return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            // DisplayColumn_'ColumnName'
            columnName: this.metadata.displayColumnName
          })
    }

    set displayedValue(value: any){
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            // DisplayColumn_'ColumnName'
            columnName: this.metadata.displayColumnName,
            value
          })
    }

     // Hooks
     async created() {
        this.changeBlankOption()
      }

    // Methods
    parseValue(value: any): string {
        if (typeof value === 'boolean') {
          // value ? 'Y' : 'N'
          value = convertBooleanToString(value)
        }
        return value
    }
      changeBlankOption(): void {
        if (Number(this.metadata.defaultValue) === -1) {
          this.blankOption.id = -1
        }
      }

      setNewDisplayedValue(): void {
        this.isFocus = true
        const displayValue = this.displayedValue
        if (this.controlDisplayed !== displayValue) {
          this.controlDisplayed = displayValue
        }
      }

      localSearch(stringToMatch: string, callBack: Function): void {
        if (!stringToMatch) {
          // not show list
          callBack([])
          return
        }
  
        const recordsList: ILookupOptions[] = this.getterLookupList
        let results: ILookupOptions[] = recordsList
        if (stringToMatch || true) {
          const parsedValue: string = stringToMatch.toLowerCase().trim()
          results = recordsList.filter((BPartner: ILookupOptions) => {
            const rowBPartner: IKeyValueObject = <IKeyValueObject>BPartner
            // columns: id, uuid, label
            for (const columnBPartner in rowBPartner) {
              const valueToCompare = String(rowBPartner[columnBPartner]).toLowerCase()
  
              if (valueToCompare.includes(parsedValue)) {
                return true
              }
            }
            return false
          })
  
          // Remote search
          if (!results) {
            clearTimeout(this.timeOut)
  
            this.timeOut = setTimeout(() => {
              this.remoteSearch(stringToMatch)
                .then(remoteResponse => {
                  callBack(remoteResponse)
                })
            }, 2000)
            return
          }
        }
  
        // call callback function to return suggestions
        callBack(results)
      }

      remoteSearch(searchValue: (string | number)[] | string): Promise<ILookupOptions[]> {
        return new Promise<ILookupOptions[]>(resolve => {
          const message: ElMessageOptions = {
            message: 'Sin resultados coincidentes con la busqueda',
            type: 'info',
            showClose: true
          }
  
          this.$store.dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            tableName: this.metadata.reference.tableName,
            query: this.metadata.reference.query,
            isAddBlankValue: true,
            blankValue: this.blankOption.id,
            valuesList: searchValue
          })
            .then(() => {
              const recordsList = this.getterLookupAll
              if (!recordsList) {
                this.$message(message)
              }
  
              resolve(recordsList)
            })
            .catch(error => {
              console.warn(error.message)
  
              this.$message(message)
              resolve([])
            })
            .finally(() => {
              this.isLoading = false
            })
        })
      }

}