<template>
  <div class="drawer-container">
    <div>
      <el-form label-position="top" :inline="true">
        <el-form-item
          :label="$t('settings.theme')"
        >
          <theme-picker @change="themeChange" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fixedHeader')"
        >
          <el-switch v-model="fixedHeader" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.tagsView')"
        >
          <el-switch v-model="showTagsView" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fixedHeader')"
        >
          <el-switch v-model="showNavar" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.showContextMenu')"
        >
          <el-switch v-model="showContextMenu" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.isShowTitle')"
        >
          <el-switch v-model="isShowTitleForm" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.isShowMenu')"
        >
          <el-switch v-model="showMenu" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.sidebarLogo')"
        >
          <el-switch v-model="showSidebarLogo" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ThemePicker from '@/components/ThemePicker/index.vue'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'Settings',
  components: {
    ThemePicker
  }
})
export default class extends Vue {
  // Data
  public activeName = '1'

  // Computed properties
  get isShowTitleForm() {
    return this.$store.getters[Namespaces.FormDefinition + '/' + 'getIsShowTitleForm']
  }

  set isShowTitleForm(val: boolean) {
    this.$store.commit(Namespaces.FormDefinition + '/' + 'changeShowTitleForm', val)
  }

  get isShowJob() {
    return this.$store.getters.language === 'zh'
  }

  get fixedHeader() {
    return this.$store.state.settings.fixedHeader
  }

  set fixedHeader(value) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', { key: 'fixedHeader', value })
  }

  get showNavar() {
    return this.$store.state.settings.showNavar
  }

  set showNavar(val: boolean | undefined) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', {
      key: 'showNavar',
      value: val
    })
  }

  get showMenu() {
    return this.$store.state.settings.showMenu
  }

  set showMenu(val: boolean | undefined) {
    this.$store.dispatch(Namespaces.App + '/' + 'ToggleSideBar', false)
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', {
      key: 'showMenu',
      value: val
    })
  }

  get showTagsView() {
    return this.$store.state.settings.showTagsView
  }

  set showTagsView(value) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', { key: 'showTagsView', value })
  }

  get showSidebarLogo() {
    return this.$store.state.settings.showSidebarLogo
  }

  set showSidebarLogo(value) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', { key: 'showSidebarLogo', value })
  }

  get sidebarTextTheme() {
    return this.$store.state.settings.sidebarTextTheme
  }

  set sidebarTextTheme(value) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', { key: 'sidebarTextTheme', value })
  }

  get showContextMenu(): boolean {
    return this.$store.state.settings.showContextMenu!
  }

  set showContextMenu(value: boolean) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', {
      key: 'showContextMenu',
      value: value
    })
  }

  get supportPinyinSearch(): boolean {
    return this.$store.state.settings.supportPinyinSearch
  }

  set supportPinyinSearch(value: boolean) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', {
      key: 'supportPinyinSearch',
      value: value
    })
  }

  get lang(): string {
    return this.$store.getters.language
  }

  private changeDisplatedTitle() {
    this.$store.commit(Namespaces.FormDefinition + '/' + 'changeShowTitleForm', !this.isShowTitleForm)
  }

  private themeChange(value: string) {
    this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', { key: 'theme', value })
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .job-link{
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
