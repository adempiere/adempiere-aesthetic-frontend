import { IBusinessPartnerData } from '@/ADempiere/modules/core'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinSearchBPartnerList'
})
export default class MixinSearchBPartnerList extends Vue {
    public isLoadedRecords = false

    convertValuesToSend(values: any) {
      return undefined
    }

    searchBPartnerList(
      values: any,
      isConvert = true
    ): Promise<IBusinessPartnerData[]> {
      if (isConvert && values) {
        values = this.convertValuesToSend(values)
      }
      return this.$store
        .dispatch('listBPartnerFromServer', values)
        .then((response: IBusinessPartnerData[]) => {
          return response
        })
        .finally(() => {
          this.isLoadedRecords = true
        })
    }
}
