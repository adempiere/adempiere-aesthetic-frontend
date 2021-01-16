import { requestGetCountryDefinition } from '@/ADempiere/modules/core/CoreService'
import { ICountryData } from '@/ADempiere/modules/core/CoreType'
import { requestGetLocationAddress } from '@/ADempiere/modules/field/FieldService/location'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinLocationField'
})
export default class MixinLocationField extends Vue {
  // Computed properties
  get currentCountryDefinition(): ICountryData | null {
    return this.$store.getters[Namespaces.System + '/' + 'getCountry']
  }

  get isShowedLocationForm() {
    return this.$store.getters[
      Namespaces.Field + '/' + 'getIsShowedLocation'
    ]
  }

    // Methods
    requestGetLocationAddress = requestGetLocationAddress
    requestGetCountryDefinition = requestGetCountryDefinition

    toggleShowedLocationForm() {
      this.$store.commit('setShowedLocation', !this.isShowedLocationForm)
    }

    setShowedLocationForm(isShow: boolean) {
      this.$store.commit('setShowedLocation', isShow)
    }

    /**
     * /TODO: Add support with sequence to displayed
     * NOTE: check if the type is ICountryData
     * @param {object} entityValues
     */
    getDisplayedValue(entityValues: any) {
      let value = ''

      if (entityValues) {
        if (entityValues.Address1) {
          value = entityValues.Address1
        }
        if (entityValues.City) {
          value += ', ' + entityValues.City
        }
        if (entityValues.RegionName) {
          value += ', ' + entityValues.RegionName
        }
        if (entityValues.Postal) {
          value += ', ' + entityValues.Postal
        }
      }

      return value
    }
}
