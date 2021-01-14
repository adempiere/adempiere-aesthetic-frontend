import { Component, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'UnsupportedView',
  mixins: [Template]
})
export default class UnsupportedView extends Vue {
  // Methods
  redirect() {
    this.$store.dispatch('tagsView/delView', this.$route)
      .then(() => {
        this.$router.push('/dashboard', undefined)
      })
  }
}
