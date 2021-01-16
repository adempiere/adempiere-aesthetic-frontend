import Template from './template.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import PriceChecking from './PriceChecking'
import VPOS from './VPOS'

@Component({
  name: 'FormPanel',
  mixins: [Template]
})
export default class FormPanel extends Vue {
    @Prop({ type: Object, required: true }) metadata: any

    // Computed properties
    // load the component that is indicated in the attributes of received property
    get componentRender() {
      let form: Promise<any> | PriceChecking | VPOS
      switch (this.metadata.fileName) {
        case 'PriceChecking':
          form = new PriceChecking() // import('@/components/ADempiere/Form/PriceChecking')
          break
        case 'VPOS':
          form = new VPOS() // import('@/components/ADempiere/Form/VPOS')
          break
        default:
          // NOTE: Migrate Unsupported view
          // form = new Unsupported() // import('@/views/ADempiere/Unsupported')
          break
      }

      return () => {
        return form
        //   return new Promise(resolve => {
        //     form
        //       .then((formFile: any) => {
        //         resolve(formFile)
        //       })
        //       .catch(() => {
        //           // NOTE: Migrate Unsupported view
        //         // import('@/views/ADempiere/Unsupported')
        //         //   .then(unsupportedFile => {
        //         //     resolve(unsupportedFile)
        //         //   })
        //       })
        //   })
      }
    }
}
