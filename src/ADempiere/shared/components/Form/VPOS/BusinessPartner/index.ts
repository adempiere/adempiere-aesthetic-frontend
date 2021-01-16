import { IBusinessPartnerData, requestGetBusinessPartner } from '@/ADempiere/modules/core'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { trimPercentage } from '@/ADempiere/shared/utils/valueFormat'
import { ElMessage, ElMessageOptions } from 'element-ui/types/message'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BusinessPartnerCreate from './BusinessPartnerCreate'
import BusinessPartnersList from './BusinessPartnersList'
import MixinBusinessPartner from './MixinBusinessPartner'

const setBusinessPartner = new MixinBusinessPartner().setBusinessPartner
const searchBPartnerList = new BusinessPartnersList().searchBPartnerList

@Component({
  name: 'FieldBusinessPartner',
  components: {
    BusinessPartnerCreate,
    BusinessPartnersList
  }
})
export default class FieldBusinessPartner extends Vue {
    @Prop({ type: Object, default: {} }) parentMetadata: any = {}
    @Prop({
      type: Object,
      default: {
        isShowCreate: false,
        isShowList: false
      }
    }) showsPopovers: any = {
      isShowCreate: false,
      isShowList: false
    }

    public controlDisplayed = this.displayedValue
    public timeOut: any = null

    // Computer properties
    get value() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.parentMetadata.containerUuid,
        columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
      })
    }

    set value(value: any) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.parentMetadata.containerUuid,
        columnName: 'C_BPartner_ID', // this.parentMetadata.columnName,
        value
      })
    }

    get displayedValue() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.parentMetadata.containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: 'DisplayColumn_C_BPartner_ID' // this.parentMetadata.displayColumnName
      })
    }

    set displayedValue(value: any) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.parentMetadata.containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: 'DisplayColumn_C_BPartner_ID', // this.parentMetadata.displayColumnName,
        value
      })
    }

    get recordsBusinessPartners(): IBusinessPartnerData[] {
      return this.$store.getters[Namespaces.System + '/' + 'getBusinessPartnersList']
    }

    get blankBPartner() {
      return {
        uuid: undefined,
        id: undefined,
        name: undefined
      }
    }

    // Methods
    setBusinessPartner = setBusinessPartner

    searchBPartnerList = searchBPartnerList

    setNewDisplayedValue(): void {
      const displayValue = this.displayedValue
      if (this.controlDisplayed !== displayValue) {
        this.controlDisplayed = displayValue
      }
    }

    setOldDisplayedValue(): void {
      if (this.controlDisplayed !== this.displayedValue) {
        this.displayedValue = this.controlDisplayed
      }
    }

    localSearch(stringToMatch: string, callBack: Function): void {
      if (!stringToMatch) {
        // not show list
        callBack([])
        return
      }

      const recordsList: IBusinessPartnerData[] = this.recordsBusinessPartners
      let results: IBusinessPartnerData[] = recordsList
      if (stringToMatch) {
        const parsedValue: string = trimPercentage(stringToMatch.toLowerCase().trim())

        results = recordsList.filter((businessPartner: IBusinessPartnerData) => {
          const rowBPartner = <IKeyValueObject>businessPartner
          for (const columnBPartner in rowBPartner) {
            const valueToCompare: string = String(rowBPartner[columnBPartner]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (!(results) && String(stringToMatch.length > 3)) {
          clearTimeout(this.timeOut)

          this.timeOut = setTimeout(() => {
            this.remoteSearch(stringToMatch)
              .then(remoteResponse => {
                callBack(remoteResponse)
              })
          }, 2000)
          return
        }
      }

      // call callback function to return suggestions
      callBack(results)
    }

    remoteSearch(searchValue: string) {
      return new Promise(resolve => {
        const message: ElMessageOptions = {
          message: 'Sin resultados coincidentes con la busqueda',
          type: 'info',
          showClose: true
        }

        this.$store.dispatch('listBPartnerFromServer', {
          pageNumber: 1,
          searchValue
        })
          .then(() => {
            const recordsList = this.recordsBusinessPartners

            if (!recordsList) {
              this.$message(message)
            }

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error.message)

            this.$message(message)
            resolve([])
          })
      })
    }

    handleSelect(selectedValue: any) {
      let businessPartner = selectedValue
      if (!businessPartner) {
        businessPartner = this.blankBPartner
      }

      this.setBusinessPartner(businessPartner, false)
    }

    onClose() {
      this.showsPopovers.isShowCreate = true
    }

    // TODO: Improve the handling of the event, if given an option to not search
    getBPartnerWithEnter(event: any): void {
      const value = String(event.target.value).trim()

      // Get one element
      // this.getBPartner(value)

      const createBP = () => {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'Name',
          value
        })
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'Value',
          value
        })

        this.showsPopovers.isShowList = false
        this.showsPopovers.isShowCreate = true
      }

      this.searchBPartnerList({
        searchValue: `%${value}%`
      }, false)
        .then(responseBPartnerList => {
          const records = responseBPartnerList.length

          if (records <= 0) {
            // open create (without records)
            createBP()
            this.controlDisplayed = ''
          } else if (records === 1) {
            // set unique match
            this.setBusinessPartner(responseBPartnerList[0], false)
            this.controlDisplayed = responseBPartnerList[0].name
          } else {
            // show list with macth's
            const columnName = 'Name' // Value
            // if (Number.isNaN(Number(value))) {
            //   columnName = 'Name'
            // }
            this.$store.commit('updateValuesOfContainer', {
              containerUuid: 'Business-Partner-List',
              attributes: [{
                columnName,
                value: `%${value}%`
              }]
            })

            this.showsPopovers.isShowList = true
            this.showsPopovers.isShowCreate = false
          }
        })
        .catch(error => {
          // create bpartner with typing values
          createBP()
          console.warn(error)
        })
    }

    getBPartner(value: string) {
      if (!value) {
        this.$message({
          type: 'warning',
          message: this.$t('notifications.fieldCannotBeEmpty').toString(),
          duration: 1500,
          showClose: true
        })
        return
      }

      requestGetBusinessPartner({
        searchValue: value
      })
        .then((responseBPartner: IBusinessPartnerData) => {
          // set id, uuid and name
          this.setBusinessPartner(responseBPartner, false)
        })
        .catch(error => {
          const message = this.$t('businessPartner.notFound') + ' ' + this.$t('data.createNewRecord')
          this.$message({
            type: 'info',
            message,
            duration: 1500,
            // showClose: true, // TODO: does not activate callback to display create form if closed with click
            onClose: this.onClose
          })

          this.setBusinessPartner({
            ...this.blankBPartner,
            name: value
          })

          this.$store.commit('updateValueOfField', {
            containerUuid: 'Business-Partner-Create',
            columnName: 'Name',
            value
          })
          this.$store.commit('updateValueOfField', {
            containerUuid: 'Business-Partner-Create',
            columnName: 'Value',
            value
          })
          console.info(`Error get Business Partner. Message: ${error.message}, code ${error.code}.`)
        })
    }
}
