import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinField'
})
export default class MixinField extends Vue {
    @Prop({ type: Object, required: true }) metadata!: any
    @Prop({
      type: [String, Number, Boolean, Date, Array, Object],
      default: null
    })
    valueModel?: [[String, Number, Boolean, Date, any[], Object]]

    // Computed properties
    get isMobile(): boolean {
      return this.$store.state.app.device === DeviceType.Mobile
    }

    get isDisabled(): boolean {
      return Boolean(this.metadata.readonly || this.metadata.disabled)
    }

    get cssClassStyle(): string {
      let styleClass = ''
      if (!isEmptyValue(this.metadata.cssClassName)) {
        styleClass = this.metadata.cssClassName
      }
      return styleClass
    }

    get value(): any {
      const { columnName, containerUuid } = this.metadata

      // table records values
      if (this.metadata.inTable) {
        const row = this.$store.getters[
          Namespaces.BusinessData + '/' + 'getRowData'
        ]({
          containerUuid,
          index: this.metadata.tableIndex
        })
        return row[columnName]
      }

      // main panel values
      return this.$store.getters[
        Namespaces.FieldValue + '/' + 'getValueOfField'
      ]({
        parentUuid: this.metadata.parentUuid,
        containerUuid,
        columnName
      })
    }

    set value(value: any) {
      if (this.metadata.inTable) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'notifyCellTableChange', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          newValue: value,
          field: this.metadata
        })
        return
      }
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value
      })
    }

    // Methods
    /**
     * Parse the value to a new value if required for element-ui component
     * compatibility where this method is overwritten
     * @param {mixed} value
     */
    parseValue(value: any): any {
      return value
    }

    /**
     * Set focus if handle focus attribute is true
     */
    requestFocus(): void {
      const requestRef = <HTMLElement> this.$refs[this.metadata.columnName]
      if (requestRef) {
        requestRef.focus()
      }
    }

    /**
     * @param {mixed} value, main value in component
     * @param {mixed} valueTo, used in end value in range
     * @param {string} label, or displayColumn to show in select
     */
    handleFieldChange(params: {
        value: any
        valueTo?: any
        label?: string
    }): void {
      const { value, valueTo, label } = params
      // Global Action performed
      if (this.metadata.handleActionPerformed) {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyActionPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }

      // if is custom field, set custom handle change value
      if (this.metadata.isCustomField) {
        if (this.metadata.isActiveLogics) {
          this.$store.dispatch(Namespaces.Panel + '/' + 'changeDependentFieldsList', {
            field: this.metadata
          })
        }
        return
      }

      if (this.metadata.inTable) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'notifyCellTableChange', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          field: this.metadata
        })
      }
      this.$store.dispatch(Namespaces.Panel + '/' + 'notifyFieldChange', {
        containerUuid: this.metadata.containerUuid,
        field: this.metadata,
        columnName: this.metadata.columnName
      })
    }

    /**
     * Overwrite component method if necessary
     * validate values before send values to store or server
     * @param {mixed} value
     */
    preHandleChange(value: any): void {
      this.handleFieldChange({ value })
    }

    focusGained(value: any): void {
      if (this.metadata.handleContentSelection) {
        // select all the content inside the text box
        if (!isEmptyValue(value.target.selectionStart) && !isEmptyValue(value.target.selectionStart)) {
          value.target.selectionStart = 0
          value.target.selectionEnd = value.target.value.length
        }
      }
      if (this.metadata.handleFocusGained) {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyFocusGained', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: this.value
        })
      }
    }

    focusLost(value: any): void {
      if (this.metadata.handleFocusLost) {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyFocusLost', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: this.value
        })
      }
    }

    keyPressed(value: any) {
      if (this.metadata.handleKeyPressed) {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyKeyPressed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.key,
          keyCode: value.keyCode
        })
      }
    }

    actionKeyPerformed(value: any): void {
      if (this.metadata.handleActionKeyPerformed) {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyActionKeyPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.target.value,
          keyCode: value.keyCode
        })
      }
    }

    keyReleased(value: any): void {
      if (this.metadata.handleKeyReleased) {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyKeyReleased', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.key,
          keyCode: value.keyCode
        })
      }
    }

    // Hooks
    async created() {
      if (
        this.metadata.isSQLValue &&
            (isEmptyValue(this.metadata.value) || this.metadata.value.isSQL)
      ) {
        const value = await this.$store.dispatch(Namespaces.BusinessData + '/' + 'getValueBySQL', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          query: this.metadata.defaultValue
        })
        // set value and change into store
        this.preHandleChange(value)
      }
    }

    mounted() {
      if (this.metadata.handleRequestFocus) {
        this.requestFocus()
      }
    }
}
