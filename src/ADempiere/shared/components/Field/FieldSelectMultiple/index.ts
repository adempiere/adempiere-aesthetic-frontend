import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldSelectMultiple',
  mixins: [Template, MixinField]
})
export default class FieldSelectMultiple extends Mixins(MixinField) {

}
