import Template from './template.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormPanel',
  mixins: [Template]
})
export default class FormPanel extends Vue {
    @Prop({ type: Object, required: true }) metadata: any

    // Computed properties
    // load the component that is indicated in the attributes of received property
    get componentRender() {
      let form: Promise<any>
      switch (this.metadata.fileName) {
        case 'PriceChecking':
          form = import('@/ADempiere/shared/components/Form/PriceChecking') // import('@/components/ADempiere/Form/PriceChecking')
          break
        case 'VPOS':
          form = import('@/ADempiere/shared/components/Form/VPOS') // import('@/components/ADempiere/Form/VPOS')
          break
        default:
          form = import('@/ADempiere/shared/views/Unsupported') // import('@/views/ADempiere/Unsupported')
          break
      }

      return () => {
        return new Promise(resolve => {
          form
            .then((formFile: any) => {
              resolve(formFile)
            })
            .catch(() => {
              // NOTE: Migrate Unsupported view
              import('@/ADempiere/shared/views/Unsupported')
                .then(unsupportedFile => {
                  resolve(unsupportedFile)
                })
            })
        })
      }
    }
}
