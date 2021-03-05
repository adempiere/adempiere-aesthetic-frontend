import { IBusinessPartnerData } from '@/ADempiere/modules/core'
import { requestCreateBusinessPartner } from '@/ADempiere/modules/core/CoreService'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import MixinBusinessPartner from '../MixinBusinessPartner'
import fieldList from './../fieldListCreate'
import Template from './template.vue'

@Component({
  name: 'BusinessPartnerCreate',
  mixins: [Template, MixinForm, MixinBusinessPartner]
})
export default class BusinessPartnerCreate extends Mixins(
  MixinForm,
  MixinBusinessPartner
) {
    @Prop({
      type: Object,
      default: {
        uuid: 'Business-Partner-Create',
        containerUuid: 'Business-Partner-Create',
        fieldList
      }
    })
    metadata: any = {
      uuid: 'Business-Partner-Create',
      containerUuid: 'Business-Partner-Create',
      fieldsList: fieldList
    }

    public businessPartnerRecord: any = {}
    public isLoadingRecord = false
    public fieldsList = fieldList
    public isCustomForm = true
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}

    // Computed properties
    get emptyMandatoryFields(): string[] {
      const field: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
        containerUuid: this.containerUuid,
        isValidate: true
      })
      return field
    }

    // Methods
    // TODO: Get locations values.
    createBusinessParter(): void {
      let values = this.$store.getters[
        Namespaces.FieldValue + '/' + 'getValuesView'
      ]({
        containerUuid: this.containerUuid,
        format: 'object'
      })
      if (!values) {
        return
      }
      values = this.convertValuesToSend(values)
      if (!this.emptyMandatoryFields) {
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
              message: error.message,
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
          message: this.$t('notifications.mandatoryFieldMissing').toString() + this.emptyMandatoryFields,
          duration: 1500,
          showClose: true
        })
      }
    }

    clearValues(): void {
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
