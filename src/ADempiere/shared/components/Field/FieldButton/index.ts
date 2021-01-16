import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import MixinFieldText from '../Mixin/MixinFieldText'
import Template from './template.vue'

@Component({
  name: 'FieldButton',
  mixins: [MixinField, MixinFieldText, Template]
})
export default class FieldButton extends Mixins(MixinField, MixinFieldText) {

}
