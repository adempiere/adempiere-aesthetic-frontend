import Template from './template.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Draggable from 'vuedraggable'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'SequenceOrder',
  components: { Draggable },
  mixins: [Template]
})
export default class SequenceOrder extends Vue {
    @Prop({ type: String, default: undefined }) parentUuid?: string = undefined
    @Prop({ type: String, required: true }) containerUuid!: string
    @Prop({ type: String, required: true }) order!: string
    @Prop({ type: String, required: true }) included!: string
    @Prop({ type: String, default: undefined }) keyColumn?: string = undefined
    @Prop({ type: Array, required: true }) identifiersList!: any[]
    public group = 'sequence'

    // Computed properties
    get getterDataRecords(): any[] {
      return this.$store.getters[
        Namespaces.Window + '/' + 'getTabSequenceRecord'
      ]
    }

    get getterListAvaliable(): any[] {
      return this.getterDataRecords.filter((item: any) => {
        return !item[this.included]
      })
    }

    get getterListSequence(): any[] {
      return this.getterDataRecords.filter((item: any) => {
        return item[this.included]
      })
    }

    get getIdentifiersList(): any[] {
      return this.identifiersList.filter(
        item => item.componentPath !== 'FieldSelect'
      )
    }

    // Methods
    displayedName(row: any): string {
      const identifiersList = this.getIdentifiersList.map(item => row[item.columnName]).join('_')
      if (identifiersList) {
        return identifiersList
      }
      return `< ${row[this.keyColumn!]} >`
    }

    /**
       * @link https://github.com/SortableJS/Vue.Draggable#events
       */
    handleChange(value: IKeyValueObject): void {
      const action = Object.keys(value)[0] // get property
      switch (action) {
        case 'added':
          this.addItem(value[action])
          break
        case 'moved':
          this.movedItem(value[action])
          break
        case 'removed':
          this.deleteItem(value[action])
          break
      }
    }

    /**
       * @param {number} newIndex: the index of the added element
       * @param {object} element: the added element
       */
    addItem(params: { element: any, newIndex: number }): void {
      const { newIndex, element } = params
      const newSequence: number = (newIndex + 1) * 10
      element[this.included] = !element[this.included]
      element[this.order] = newSequence
      const dataSequence = this.getterDataRecords.map(itemSequence => {
        if (itemSequence.UUID === element.UUID) {
          return element
        }
        if (newSequence <= itemSequence[this.order]) {
          itemSequence[this.order] = itemSequence[this.order] + 10
        }
        return itemSequence
      })

      this.$store.dispatch('setTabSequenceRecord', this.getOrder(dataSequence))
    }

    /**
       * @param {number} newIndex: the current index of the moved element
       * @param {number} oldIndex: the old index of the moved element
       * @param {object} element: the moved element
       */
    movedItem(params: { newIndex: number, oldIndex: number, element: any }): void {
      const { newIndex, oldIndex, element } = params
      let indexEnabledSequence = 0
      const dataSequence: any[] = this.getterDataRecords.map(itemSequence => {
        if (!itemSequence[this.included]) {
          itemSequence[this.order] = 0
          return itemSequence
        }
        if (newIndex > oldIndex) {
          // moved to down
          if (itemSequence.UUID === element.UUID) {
            itemSequence[this.order] = (newIndex + 1) * 10
            return itemSequence
          }
          if (indexEnabledSequence >= oldIndex && indexEnabledSequence < newIndex) {
            itemSequence[this.order] = (indexEnabledSequence + 1) * 10
          }
        } else {
          // moved to up
          if (itemSequence.UUID === element.UUID) {
            itemSequence[this.order] = (newIndex + 1) * 10
            return itemSequence
          }
          if (indexEnabledSequence < oldIndex && indexEnabledSequence >= newIndex) {
            itemSequence[this.order] += 10
          }
        }
        indexEnabledSequence++
        return itemSequence
      })

      this.$store.dispatch('setTabSequenceRecord', this.getOrder(dataSequence))
    }

    /**
       * @param {number} oldIndex: the index of the element before remove
       * @param {object} element: the removed element
       */
    deleteItem(params: { element: any, oldIndex?: Number }) {
      const { element, oldIndex } = params
      const oldSequence = element[this.order] // (oldIndex + 1) * 10
      const dataSequence = this.getterDataRecords.map(itemSequence => {
        if (itemSequence.UUID === element.UUID) {
          itemSequence[this.included] = !itemSequence[this.included]
          itemSequence[this.order] = 0
          return itemSequence
        }
        if (itemSequence[this.order] > oldSequence && itemSequence[this.order] > 0) {
          itemSequence[this.order] = itemSequence[this.order] - 10
        }
        return itemSequence
      })

      this.$store.dispatch('setTabSequenceRecord', this.getOrder(dataSequence))
    }

    getOrder(arrayToSort: any[], orderBy: string = this.order): any[] {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
    }
}
