import { createLocationAddress, updateLocationAddress } from '@/ADempiere/modules/field/FieldService/location'
import { IEntityData, KeyValueData } from '@/ADempiere/modules/persistence/PersistenceType'
import { getSequenceAsList } from '@/ADempiere/shared/utils/location'
import { showNotification } from '@/ADempiere/shared/utils/notifications'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinForm from '../../../Form/MixinForm'
import MixinLocationField from '../MixinLocation'
import Template from './template.vue'

@Component({
  name: 'LocationAddressForm',
  mixins: [MixinLocationField, MixinForm, Template]
})
export default class LocationAddressForm extends Mixins(MixinLocationField, MixinForm) {
    @Prop({ type: Object }) parentMetadata: any
    @Prop({ type: Object }) values: any
    @Prop({
      type: Object,
      default: () => {
        return {
        // TODO: Add container uuid parent
          uuid: 'Location-Address-Create',
          containerUuid: 'Location-Address-Create'
        }
      }
    }) metadata: any

    public iscustomForm = true
    public request = 0
    fieldsList: any[] = []

    // Computed properties
    get fieldsListLocation(): any[] {
      if (this.$store.getters[Namespaces.Field + '/' + 'getFieldLocation'].getFieldLocation) {
        return this.$store.getters[Namespaces.Field + '/' + 'getFieldLocation']
      }
      return this.fieldsList
    }

    get locationId(): any {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid: this.parentMetadata.parentUuid,
        containerUuid: this.parentMetadata.containerUuid,
        columnName: this.parentMetadata.columnName
      })
    }

    // Methods
    keyAction(event: any) {
      if (event.srcKey === 'closeForm') {
        this.toggleShowedLocationForm()
      }
    }

    sortSequence(itemA: any, itemB: any): number {
      return itemA.index - itemB.index
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        const withOutColumnNames: string[] = ['C_Country_ID', 'DisplayColumn_C_Country_ID', 'C_Location_ID']
        if (mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField' &&
            mutation.payload.containerUuid === this.metadata.containerUuid) {
          if (mutation.payload.columnName === 'C_Country_ID') {
            const values: KeyValueData[] = []
            // Get country definition to sequence fields and displayed value
            if (mutation.payload.value !== this.currentCountryDefinition?.id) {
              this.requestGetCountryDefinition({
                id: mutation.payload.value
              })
                .then(responseCountry => {
                  const newSequence: string[] = getSequenceAsList(responseCountry.captureSequence)!
                  const newFieldsList: any[] = this.fieldsList.map(item => {
                    if (newSequence.includes(item.sequenceFields)) {
                      return {
                        ...item,
                        isDisplayed: true,
                        index: newSequence.indexOf(item.sequenceFields)
                      }
                    }
                    return {
                      ...item,
                      isDisplayed: false
                    }
                  })
                  this.$store.dispatch(Namespaces.Field + '/' + 'changeSequence', newFieldsList.sort(this.sortSequence))
                })
                .catch(error => {
                  this.$message({
                    message: error.message,
                    showClose: true,
                    // isShowClose: true,
                    type: 'error'
                  })
                  console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
                })
            }

            this.fieldsList.forEach(item => {
              if (!withOutColumnNames.includes(item.columnName)) {
                values.push({
                  key: item.columnName,
                  value: undefined
                })
              }
            })

            this.setValues({
              values,
              withOutColumnNames
            })
          }
        }
      })
    }

    setParentValues(values: any): void {
      const {
        parentUuid,
        containerUuid,
        columnName, // 'C_Location_ID' by default
        displayColumnName
      } = this.parentMetadata

      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName,
        value: values[columnName]
      })

      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: displayColumnName,
        value: this.getDisplayedValue(values)
      })

      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'Postal',
        value: values.Postal
      })

      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_Country_ID',
        value: values.C_Country_ID
      })

      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_City_ID',
        value: values.C_City_ID
      })

      // active update record to server
      // this.$store.dispatch('notifyFieldChange', {
      //   containerUuid,
      //   field: this.parentMetadata
      // })
    }

    sendValuesToServer(): void {
      const fieldsNotReady = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
        containerUuid: this.containerUuid,
        isValidate: true
      })
      if (fieldsNotReady) {
        showNotification({
          type: 'warning',
          title: this.$t('notifications.emptyValues').toString(),
          name: '<b>' + fieldsNotReady + '.</b> ',
          message: this.$t('notifications.fieldMandatory').toString(),
          isRedirect: false
        })
        return
      }

      const locationId: number = this.locationId

      const attributes: KeyValueData[] = this.$store.getters[Namespaces.FieldValue + '/' + 'getValuesView']({
        containerUuid: this.containerUuid
      })
      const attributesToServer: KeyValueData[] = attributes.filter((attributeItem: KeyValueData) => {
        const { key: columnName } = attributeItem
        if (columnName.includes('DisplayColumn_')) {
          return false
        }
        if (columnName === 'C_Location_ID') {
          return false
        }
        return true
      })

      const updateLocation = (responseLocation: any) => {
        // set form values
        this.setValues({
          values: responseLocation.attributes
        })

        // set field parent values
        this.setParentValues(responseLocation.attributes)
        this.setShowedLocationForm(false)

        // set context values to parent continer
        if (this.parentMetadata.isSendParentValues) {
          this.$store.dispatch(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
            parentUuid: this.parentMetadata.parentUuid,
            containerUuid: this.parentMetadata.containerUuid,
            attributes: <KeyValueData[]>attributes
          })
        }
      }

      if (!locationId || locationId === 0) {
        createLocationAddress({
          attributesList: attributesToServer
        })
          .then(updateLocation)
          .catch(error => {
            this.$message({
              message: error.message,
              showClose: true,
              // isShowClose: true,
              type: 'error'
            })
            console.warn(`Error create Location Address: ${error.message}. Code: ${error.code}.`)
          })
          // break to only create
        return
      }
      updateLocationAddress({
        id: locationId,
        attributesList: attributesToServer
      })
        .then(updateLocation)
        .catch(error => {
          this.$message({
            message: error.message,
            showClose: true,
            // isShowClose: true,
            type: 'error'
          })
          console.warn(`Error update Location Address: ${error.message}. Code: ${error.code}.`)
        })
      this.$store.dispatch(Namespaces.Field + '/' + 'changeSequence', this.fieldsList)
    }

    getLocation(): void {
      if (this.request > 0) {
        return
      }

      if (this.values) {
        this.setValues({
          values: this.values
        })
        return
      }

      const id = this.locationId
      if (!id) {
        return
      }

      this.getLocationAddress({
        id
      })
        .then((responseLocation: IEntityData) => {
          const { attributes: values } = responseLocation

          this.setValues({
            values
          })
          this.request++
        })
        .catch(error => {
          console.warn(`Get Location Address, Form Location - Error ${error.code}: ${error.message}.`)
        })
    }

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()
    }

    mounted() {
      this.getLocation()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
