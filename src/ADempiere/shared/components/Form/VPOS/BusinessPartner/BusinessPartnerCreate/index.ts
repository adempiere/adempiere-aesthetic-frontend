import { IBusinessPartnerData } from '@/ADempiere/modules/core'
import { requestCreateBusinessPartner } from '@/ADempiere/modules/core/CoreService'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import MixinBusinessPartner from '../MixinBusinessPartner'
import fieldsList from './../fieldListCreate'
import Template from './template.vue'
import FieldDefinition from '@/ADempiere/shared/components/Field'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

@Component({
  name: 'BusinessPartnerCreate',
  components: {
    FieldDefinition
  },
  mixins: [Template, MixinForm, MixinBusinessPartner]
})
export default class BusinessPartnerCreate extends Mixins(
  MixinForm,
  MixinBusinessPartner
) {
    @Prop({
      type: Object,
      default: () => {
        return {
          uuid: 'Business-Partner-Create',
          containerUuid: 'Business-Partner-Create',
          fieldsList
        }
      }
    })
    metadata: any

    @Prop({
      type: Boolean,
      default: false
    }) showField!: boolean

    public businessPartnerRecord: any = {}
    public isLoadingRecord = false
    fieldsList = fieldsList
    public isCustomForm = true
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}

    // Watch
    @Watch('showField')
    handleShowFieldChange(value: boolean) {
      if (value) {
        setTimeout(() => {
          this.focusValue()
        }, 1500)
      }
    }

    // Methods
    focusValue() {
      ((this.$refs.Value as Vue[])[0].$children[0].$children[0].$children[1].$children[0] as any).focus()
    }

    // TODO: Get locations values.
    createBusinessParter(): void {
      let values = this.$store.getters[
        Namespaces.FieldValue + '/' + 'getValuesView'
      ]({
        containerUuid: this.containerUuid,
        format: 'object'
      })
      const name2 = this.$store.getters[Namespaces.FieldValue + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'Name2'
      })
      values = this.convertValuesToSend(values)
      values.name2 = name2
      const emptyMandatoryFields = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
        containerUuid: this.containerUuid,
        formatReturn: 'name'
      })
      if (isEmptyValue(emptyMandatoryFields)) {
        this.isLoadingRecord = true
        requestCreateBusinessPartner(values)
          .then((responseBPartner: IBusinessPartnerData) => {
            // TODO: Add new record into vuex store.
            this.setBusinessPartner(responseBPartner)
            this.clearValues()
            this.$message({
              type: 'success',
              message: this.$t('form.pos.order.BusinessPartnerCreate.businessPartner').toString(),
              duration: 1500,
              showClose: true
            })
          })
          .catch(error => {
            this.showsPopovers.isShowCreate = true
            this.$message({
              type: 'warning',
              message: error.message + 'Name',
              duration: 1500,
              showClose: true
            })
            console.warn(
                      `Error create Business Partner. Message: ${error.message}, code ${error.code}.`
            )
          })
          .finally(() => {
            this.isLoadingRecord = false
          })
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('notifications.mandatoryFieldMissing').toString() + emptyMandatoryFields,
          duration: 1500,
          showClose: true
        })
      }
    }

    clearValues(): void {
      this.$store.dispatch(Namespaces.Utils + '/' + 'changePopover', false)
      this.showsPopovers.isShowCreate = false

      this.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
        containerUuid: this.containerUuid,
        panelType: this.panelType
      })
      this.clearLocationValues()
    }

    clearLocationValues(): void {
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
        containerUuid: this.containerUuid,
        attributes: [
          {
            key: 'C_Location_ID',
            value: undefined
          },
          {
            key: 'DisplayColumn_C_Location_ID',
            value: undefined
          },
          {
            key: 'C_Country_ID',
            value: undefined
          },
          {
            key: 'C_Country_ID_UUID',
            value: undefined
          },
          {
            key: 'DisplayColumn_C_Country_ID',
            value: undefined
          },
          {
            key: 'C_Region_ID',
            value: undefined
          },
          {
            key: 'C_Region_ID_UUID',
            value: undefined
          },
          {
            key: 'DisplayColumn_C_Region_ID',
            value: undefined
          },
          {
            key: 'C_City_ID',
            value: undefined
          },
          {
            key: 'C_City_ID_UUID',
            value: undefined
          },
          {
            key: 'DisplayColumn_C_City_ID',
            value: undefined
          },
          {
            key: 'Address1',
            value: undefined
          },
          {
            key: 'Address2',
            value: undefined
          },
          {
            key: 'Address3',
            value: undefined
          },
          {
            key: 'Address4',
            value: undefined
          }
        ]
      })
    }

    // Hooks
    beforeDestroy() {
      this.unsubscribe()
    }
}
