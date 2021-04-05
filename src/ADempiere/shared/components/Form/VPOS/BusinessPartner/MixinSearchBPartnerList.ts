import { IBusinessPartnerData } from '@/ADempiere/modules/core'
import { Namespaces } from '@/ADempiere/shared/utils/types'
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
        .dispatch(Namespaces.BusinessPartner + '/' + 'listBPartnerFromServer', values)
        .then((response: IBusinessPartnerData[]) => {
          return response
        })
        .finally(() => {
          this.isLoadedRecords = true
        })
    }
}
