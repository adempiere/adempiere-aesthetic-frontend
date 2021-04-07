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
import MixinSearchBPartnerList from '../MixinSearchBPartnerList'
import FieldDefinition from '@/ADempiere/shared/components/Field'

@Component({
  name: 'BusinessPartnersList',
  components: {
    CustomPagination,
    FieldDefinition
  },
  mixins: [Template, MixinForm, MixinBusinessPartner, MixinSearchBPartnerList]
})
export default class BusinessPartnersList extends Mixins(
  MixinForm,
  MixinBusinessPartner,
  MixinSearchBPartnerList
) {
    @Prop({
      type: Object,
      default: () => {
        return {
          uuid: 'Business-Partner-List',
          containerUuid: 'Business-Partner-List'
        }
      }
    })
    metadata: any

    @Prop({
      type: Object,
      default: () => {
        return {
          isShowCreate: false,
          isShowList: false
        }
      }
    })
    showsPopovers: any

    isLoadedRecords = false
    public activeAccordion = 'query-criteria'
    fieldsList = fieldList
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}

    // Computed properties
    get businessParners(): BusinessPartnerState {
      return this.$store.getters[Namespaces.BusinessPartner + '/' + 'getBusinessPartner']
    }

    get businessPartnersList(): IBusinessPartnerData[] {
      return this.$store.getters[
        Namespaces.BusinessPartner + '/' + 'getBusinessPartnersList'
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
          mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField' &&
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
