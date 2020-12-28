import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinInfo'
})
export default class MixinInfo extends Vue {
  get language() {
    return this.$store.getters.getters.language
  }

  translateDate(value: Date | number | string) {
    return this.$d(new Date(value), 'long', this.language)
  }
}
