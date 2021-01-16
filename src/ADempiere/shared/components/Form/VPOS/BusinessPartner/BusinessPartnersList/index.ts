import CustomPagination from '@/ADempiere/shared/components/Pagination'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import MixinBusinessPartner from '../MixinBusinessPartner'
import Template from './template.vue'
import fieldList from './../fieldListSearch'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import {
  BusinessPartnerState,
  IBusinessPartnerData
} from '@/ADempiere/modules/core'

@Component({
  name: 'BusinessPartnersList',
  components: {
    CustomPagination
  },
  mixins: [Template, MixinForm, MixinBusinessPartner, CustomPagination]
})
export default class BusinessPartnersList extends Mixins(
  MixinForm,
  MixinBusinessPartner
) {
    @Prop({
      type: Object,
      default: {
        uuid: 'Business-Partner-List',
        containerUuid: 'Business-Partner-List'
      }
    })
    metadata: any = {
      uuid: 'Business-Partner-List',
      containerUuid: 'Business-Partner-List'
    }

    @Prop({
      type: Object,
      default: {
        isShowCreate: false,
        isShowList: false
      }
    })
    showsPopovers: any = {
      isShowCreate: false,
      isShowList: false
    }

    public isLoadedRecords = false
    public activeAccordion = 'query-criteria'
    public fieldList = fieldList
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}

    // Computed properties
    get businessParners(): BusinessPartnerState {
      return this.$store.getters[Namespaces.System + 'getBusinessPartner']
    }

    get businessPartnersList(): IBusinessPartnerData[] {
      return this.$store.getters[
        Namespaces.System + 'getBusinessPartnersList'
      ]
    }

    get isReadyFromGetData(): boolean {
      const { isLoaded, isReload } = this.businessParners
      return (!isLoaded || isReload) && this.showsPopovers.isShowList
    }

    // Watchers
    @Watch('isReadyFromGetData')
    handleIsReadyFromGetDataChange(isToLoad: boolean) {
      if (isToLoad) {
        this.searchBPartnerList({})
      }
    }

    // Methods
    keyAction(event: any) {
      switch (event.srcKey) {
        case 'refreshList': {
          const values = this.$store.getters[
            Namespaces.FieldValue + '/' + 'getValuesView'
          ]({
            containerUuid: this.metadata.containerUuid,
            format: 'object'
          })

          this.searchBPartnerList(values)
          break
        }
        case 'refreshListWithoutValues': {
          this.searchBPartnerList({})
          break
        }
        case 'closeForm':
          this.closeForm()
          break
      }
    }

    handleCurrentChange(row: any) {
      this.setBusinessPartner(row)
    }

    handleChangePage(newPage: number) {
      this.$store.dispatch('setBPartnerPageNumber', newPage)
    }

    subscribeChanges() {
      return this.$store.subscribe(mutation => {
        if (
          mutation.type === 'updateValueOfField' &&
                mutation.payload.containerUuid === this.metadata.containerUuid
        ) {
          const values = this.$store.getters[
            Namespaces.FieldValue + '/' + 'getValuesView'
          ]({
            containerUuid: mutation.payload.containerUuid,
            format: 'object'
          })

          this.searchBPartnerList(values)
        }
      })
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

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()

      if (this.isReadyFromGetData) {
        this.searchBPartnerList({})
      }
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
