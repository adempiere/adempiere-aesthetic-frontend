import VueI18n from 'vue-i18n'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinI18n'
})
export default class MixinI18n extends Vue {
  // translate router.meta.title, be used in breadcrumb sidebar tagsview
  generateTitle(title: string): VueI18n.TranslateResult {
    const hasKey: boolean = this.$te('route.' + title)

    if (hasKey) {
      // $t :this method from vue-i18n, inject in @/lang/index.js
      const translatedTitle = this.$t('route.' + title)

      return translatedTitle
    }
    return title
  }
}
