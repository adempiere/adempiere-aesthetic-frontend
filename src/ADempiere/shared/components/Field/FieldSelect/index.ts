import { ILookupOptions } from '@/ADempiere/modules/ui'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { convertBooleanToString } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldSelect',
  mixins: [Template, MixinField]
})
export default class FieldSelect extends Mixins(MixinField) {
    private label = ''
    private blankOption: Partial<ILookupOptions> = {
      id: undefined,
      uuid: undefined,
      label: this.label
    }

    public isLoading = false
    public optionsList: Partial<ILookupOptions>[] = [this.blankOption]
    public blankValues: any[] = [null, undefined, -1]

    // Computed properties
    get isPanelWindow(): boolean {
      return this.metadata.panelType === 'window'
    }

    get isSelectMultiple(): boolean {
      return (
        ['IN', 'NOT_IN'].includes(this.metadata.operator) &&
            this.metadata.isAdvancedQuery
      )
    }

    get cssClassStyle(): string {
      let styleClass = ' custom-field-select '
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple '
      }
      if (this.metadata.cssClassName) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }

    get getterLookupList(): ILookupOptions[] {
      if (!this.metadata.reference.query || !this.metadata.displayed) {
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
      const allOptions = this.$store.getters[
        Namespaces.Lookup + '/' + 'getLookupAll'
      ]({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.reference.query,
        directQuery: this.metadata.reference.directQuery,
        tableName: this.metadata.reference.tableName,
        value: this.value
      })

      // sets the value to blank when the lookupList or lookupItem have no
      // values, or if only lookupItem does have a value
      if (
        !allOptions ||
            (allOptions.length && !this.blankValues.includes(allOptions[0].id))
      ) {
        allOptions.unshift(this.blankOption)
      }
      return allOptions
    }

    get value() {
      const { columnName, containerUuid } = this.metadata
      let value
      // table records values
      if (this.metadata.inTable) {
        const row = this.$store.getters[
          Namespaces.BusinessData + '/' + 'getRowData'
        ]({
          containerUuid,
          index: this.metadata.tableIndex
        })
        value = row[columnName]
      } else {
        value = this.$store.getters[
          Namespaces.FieldValue + '/' + 'getValueOfField'
        ]({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      }

      if (!value) {
        /* eslint-disable */
            this.displayedValue = undefined
            this.uuidValue = undefined
            /* eslint-disable */
            return value
        }

        const option = this.findOption(value)
        if (!option.label) {
            const label = this.displayedValue
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

    set value(value: any) {
        const option = this.findOption(value)
        // always update uuid
        this.uuidValue = option.uuid

        this.$store.dispatch(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            columnName: this.metadata.columnName,
            value
        })
    }

    get uuidValue(): any {
        if (this.metadata.inTable) {
            return undefined
        }
        return this.$store.getters[
            Namespaces.FieldValue + '/' + 'getValueOfField'
        ]({
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            // 'ColumnName'_UUID
            columnName: this.metadata.columnName + '_UUID'
        })
    }

    set uuidValue(value: any) {
        if (this.metadata.inTable) {
            return
        }
        this.$store.dispatch(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            // 'ColumnName'_UUID
            columnName: this.metadata.columnName + '_UUID',
            value
        })
    }

    get displayedValue(): any {
        const { displayColumnName: columnName, containerUuid } = this.metadata
        // table records values
        if (this.metadata.inTable) {
            const row = this.$store.getters[
                Namespaces.BusinessData + '/' + 'getRowData'
            ]({
                containerUuid,
                index: this.metadata.tableIndex
            })
            // DisplayColumn_'ColumnName'
            return row[columnName]
        }
        return this.$store.getters[
            Namespaces.FieldValue + '/' + 'getValueOfField'
        ]({
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            // DisplayColumn_'ColumnName'
            columnName
        })
    }

    set displayedValue(value: any) {
        this.$store.dispatch(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            // DisplayColumn_'ColumnName'
            columnName: this.metadata.displayColumnName,
            value
        })
    }

    // Watcher
    @Watch('isSelectMultiple')
    handleIsSelectMultiple(isMultiple: boolean) {
        let value = this.value
        if (isMultiple) {
            const valueInArray = []
            if (value) {
                valueInArray.push(value)
            }
            value = valueInArray
        } else {
            if (Array.isArray(value)) {
                if (value.length) {
                    // set first value
                    value = value[0]
                } else {
                    value = this.blankOption.id
                }
            }
        }
        this.value = value
    }

    @Watch('metadata.displayed')
    hanldeMetadataDisplayedChange(value: any) {
        if (value) {
            // if is field showed, search into store all options to list
            this.optionsList = this.getterLookupAll
        }
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
            this.blankOption.id = this.metadata.defaultValue
        }
    }

    findOption(value: any): ILookupOptions | Partial<ILookupOptions> {
        const option = this.optionsList.find(item => item.id === value)
        if (option && option.label) {
            return <ILookupOptions>option
        }
        return <Partial<ILookupOptions>>{
            label: undefined,
            value: undefined,
            uuid: undefined
        }
    }

    preHandleChange(value: any) {
        const { label } = <ILookupOptions>this.findOption(value)
        this.displayedValue = label
        this.handleFieldChange({
            value,
            label: <string>label
        })
    }

    async getDataLookupItem() {
        if (
            (!this.metadata.reference.directQuery) ||
            (this.metadata.isAdvancedQuery && this.isSelectMultiple)
        ) {
            return
        }
        this.isLoading = true
        this.$store
            .dispatch(Namespaces.Lookup + '/' + 'getLookupItemFromServer', {
                parentUuid: this.metadata.parentUuid,
                containerUuid: this.metadata.containerUuid,
                tableName: this.metadata.reference.tableName,
                directQuery: this.metadata.reference.directQuery,
                value: this.value
            })
            .then(responseLookupItem => {
                this.displayedValue = responseLookupItem?.label
                this.uuidValue = responseLookupItem?.uuid
                this.$nextTick(() => {
                    this.optionsList = this.getterLookupAll
                })
            })
            .finally(() => {
                this.isLoading = false
            })
    }

    remoteMethod(): void {
        this.isLoading = true
        this.$store
            .dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
                parentUuid: this.metadata.parentUuid,
                containerUuid: this.metadata.containerUuid,
                columnName: this.metadata.columnName,
                tableName: this.metadata.reference.tableName,
                query: this.metadata.reference.query,
                whereClause: this.metadata.validationCode,
                // valuesList: this.value
                isAddBlankValue: true,
                blankValue: this.blankOption.id
            })
            .then(responseLookupList => {
                if (responseLookupList) {
                    this.optionsList = responseLookupList
                } else {
                    this.optionsList = this.getterLookupAll
                }
            })
            .finally(() => {
                this.isLoading = false
            })
    }

    /**
     * @param {boolean} isShowList triggers when the pull-down menu appears or disappears
     */
    getDataLookupList(isShowList: boolean): void {
        if (isShowList) {
            // TODO: Evaluate if length = 1 and this element id = blankOption
            const list = this.getterLookupList
            if ((!list.length) || (list.length === 1 && this.blankValues.includes(list[0]))
            ) {
                this.remoteMethod()
            }
        }
    }

    clearLookup() {
        // set empty list and empty option
        this.optionsList = [this.blankOption]

        this.$store.dispatch(Namespaces.Lookup + '/' + 'deleteLookupList', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            tableName: this.metadata.reference.tableName,
            query: this.metadata.reference.query,
            directQuery: this.metadata.reference.directQuery,
            value: this.value
        })

        // set empty value
        this.value = this.blankOption.id
    }

    // Hooks
    async created() {
        this.changeBlankOption()
    }

    beforeMount() {
        if (this.metadata.displayed) {
            this.optionsList = this.getterLookupAll
            const value = this.value
            if (value && !this.metadata.isAdvancedQuery) {
                const option = this.findOption(value)
                if (option.label) {
                    this.displayedValue = option.label
                    this.uuidValue = option.uuid
                } else {
                    // TODO: Property displayColumn is @deprecated
                    if (this.metadata.displayColumn) {
                        // verify if exists to add
                        this.optionsList.push({
                            id: value,
                            // TODO: Add uuid
                            label: this.metadata.displayColumn
                        })
                    } else {
                        if (
                            !this.isPanelWindow ||
                            (this.isPanelWindow &&
                                this.$route.query)
                        ) {
                            this.getDataLookupItem()
                        }
                    }
                }
            }
        }
    }
}
