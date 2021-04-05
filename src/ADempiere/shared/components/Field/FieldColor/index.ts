import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import MixinFieldText from '../Mixin/MixinFieldText'
import Template from './template.vue'

@Component({
  name: 'FieldColor',
  mixins: [MixinField, MixinFieldText, Template]
})
export default class FieldColor extends Mixins(MixinField, MixinFieldText) {

}
