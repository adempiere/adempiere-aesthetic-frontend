import { INotificationProcessData } from '@/ADempiere/modules/process/ProcessType'
import { Prop, Ref, Watch, Component, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'Badge',
  mixins: [Template]
})
export default class Badge extends Vue {
    public show!: boolean
    public options!: any[]
    @Ref() readonly badge!: HTMLElement
    @Prop({ default: null }) private currentRow: any

    get getRecordNotification(): INotificationProcessData[] {
      // return this.$store.getters.getNotificationProcess
      // return this.$store.getters.getNotificationProcess()
      return this.$store.getters['processModule/getNotificationProcess']
    }

    @Watch('show')
    onPropertyChanged(value: string) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }

    // Methods
    close() {
      // this.$refs.badge && this.$refs.badge.blur()
      this.badge && this.badge.blur()
      this.options = []
      this.show = false
    }

    handleCurrentChange(val: any) {
      if (val !== null) {
        let options: {
              name: string
              params?: {
                  processId?: number
                  instanceUuid?: string
                  fileName?: string
              }
          } = {
            name: 'ProcessActivity'
          }
        if (this.getRecordNotification && this.getRecordNotification[0].isReport && val.className !== 'procesActivity') {
          options = {
            name: 'Report Viewer',
            params: {
              processId: this.getRecordNotification[0].processId,
              instanceUuid: this.getRecordNotification[0].instanceUuid,
              fileName: this.getRecordNotification[0].download
            }
          }
        }
        // this.$router.push(options.name, () => {})
        this.$router.push(options.name)
      }
    }

    deleteRow(index: number, rows: any[]) {
      rows.splice(index, 1)
    }

    deleteAll() {
      // rows.splice(index, rows.lenght)
      this.getRecordNotification.splice(0)
    }
}
