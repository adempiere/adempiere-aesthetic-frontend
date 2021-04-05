import { Vue, Component, Prop } from 'vue-property-decorator'
import { ContentLoader as ViewContentLoader } from 'vue-content-loader'
import Template from './template.vue'

@Component({
  name: 'ContentLoader',
  components: {
    ViewContentLoader
  },
  mixins: [
    Template
  ]
})
export default class ContentLoader extends Vue {
    width = 300
    height = 300
}
