import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import MixinSetBusinessPartner from '../BusinessPartner/MixinSetBusinessPartner'

@Component({
  name: 'MixinBusinessPartner',
  mixins: [MixinSetBusinessPartner]
})
export default class MixinBusinessPartner extends Mixins(MixinSetBusinessPartner) {
    @Prop({
      type: Object,
      default: () => {
        return { panelType: 'form', isShowCreate: false, isShowList: false }
      }
    }) showsPopovers!: {
        panelType: PanelContextType
        isShowCreate: boolean
        isShowList: boolean
    }

    // Computed properties
    shortsKey() {
      return {
        closeForm: ['esc'],
        refreshListWithoutValues: ['shift', 'r'],
        refreshList: ['f5']
      }
    }

    // Methods
    keyAction(event: any): void {
      switch (event.srcKey) {
        case 'closeForm':
          this.closeForm()
          break
      }
    }

    closeForm(): void {
      this.showsPopovers.isShowList = false
      this.showsPopovers.isShowCreate = false
    }

    /**
       * ColumnName equals property to set into request's system-core
       * @param {object} values
       * @returns {object}
       */
    convertValuesToSend(values: any): IKeyValueObject {
      const valuesToSend: IKeyValueObject = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (!value) {
          return
        }
        switch (key) {
          case 'Code':
            // Only used with search
            valuesToSend.searchValue = value
            break
          case 'Value':
            valuesToSend.value = value
            break
          case 'Name':
            valuesToSend.name = value
            break
          case 'Contact':
            valuesToSend.contactName = value
            break
          case 'EMail':
            valuesToSend.eMail = value
            break
          case 'Phone':
            valuesToSend.phone = value
            break
            // Location values
          case 'C_Country_ID_UUID':
            valuesToSend.countryUuid = value
            break
          case 'C_Region_ID_UUID':
            valuesToSend.regionUuid = value
            break
          case 'DisplayColumn_C_Region_ID':
            valuesToSend.regionName = value
            break
          case 'C_City_ID_UUID':
            valuesToSend.cityUuid = value
            break
          case 'DisplayColumn_C_City_ID':
            valuesToSend.cityName = value
            break
          case 'Address1':
            valuesToSend.address1 = value
            break
          case 'Address2':
            valuesToSend.address2 = value
            break
          case 'Address3':
            valuesToSend.address3 = value
            break
          case 'Address4':
            valuesToSend.address4 = value
            break
          case 'Postal':
            valuesToSend.postalCode = value
            break
        }
      })

      valuesToSend.posUuid = <string> this.$store.getters[Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid']
      return valuesToSend
    }
}
