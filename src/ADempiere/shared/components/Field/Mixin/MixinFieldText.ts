import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinFieldText'
})
export default class MixinFieldText extends Vue {
  // Methods
  parseValue(value: any): string {
    if (!value) {
      value = ''
    }
    return String(value)
  }
}
