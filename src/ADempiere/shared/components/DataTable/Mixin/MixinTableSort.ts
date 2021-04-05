import { Component, Mixins, Ref } from 'vue-property-decorator'
import MixinTable from './MixinTable'
import Sortable, { SortableEvent } from 'sortablejs'
import { Table } from 'element-ui'

@Component({
  name: 'MixinTableSort'
})
export default class MixinTableSort extends Mixins(MixinTable) {
    @Ref() readonly multipleTable?: Table
    public sortable?: Sortable | null
    public oldgetDataDetail?: any[]
    public newgetDataDetail?: any

    // Methods
    async getList() {
      this.oldgetDataDetail = this.recordsData.map(v => v.id)
      this.newgetDataDetail = this.oldgetDataDetail.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    }

    setSort(): void {
      if (!this.isMobile) {
        const el: HTMLElement = <HTMLElement> this.multipleTable!.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: (dataTransfer: DataTransfer) => {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: (evt: SortableEvent) => {
            const targetRow = this.recordsData.splice(evt.oldIndex!, 1)[0]
            this.recordsData.splice(evt.newIndex!, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newgetDataDetail.splice(evt.oldIndex, 1)[0]
            this.newgetDataDetail.splice(evt.newIndex, 0, tempIndex)
          }
        })
      }
    }
}
