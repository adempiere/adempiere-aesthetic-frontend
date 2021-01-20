import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinI18n'
})
export default class MixinI18n extends Vue {
  // translate router.meta.title, be used in breadcrumb sidebar tagsview
  generateTitle(title: string): string {
    const hasKey = this.$te('route.' + title)

    if (hasKey) {
      // $t :this method from vue-i18n, inject in @/lang/index.js
      const translatedTitle = this.$t('route.' + title)

      return translatedTitle.toString()
    }
    return title
  }
}
