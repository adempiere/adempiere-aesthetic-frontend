<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{ $t('settings.title') }}</h3>

      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.tagsView') }}</span>
        <el-switch v-model="showTagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.showContextMenu') }}</span>
        <el-switch v-model="showContextMenu" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Show Header</span>
        <el-switch v-model="showNavar" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Show Menu</span>
        <el-switch v-model="showMenu" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebarLogo') }}</span>
        <el-switch v-model="showSidebarLogo" class="drawer-switch" />
      </div>

      <a v-if="isShowJob" href="https://panjiachen.github.io/vue-element-admin-site/zh/job/" target="_blank" class="job-link">
        <el-alert
          title="部门目前非常缺人！有兴趣的可以点击了解详情。坐标: 字节跳动"
          type="success"
          :closable="false"
        />
      </a>

      <div v-if="lang === 'zh'" class="drawer-item">
        <span>菜单支持拼音搜索</span>
        <el-switch v-model="supportPinyinSearch" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import ThemePicker from '@/components/ThemePicker/index.vue'

@Component({
  name: 'Settings',
  components: {
    ThemePicker
  }
})
export default class extends Vue {
  get isShowJob() {
    return this.$store.getters.language === 'zh'
  }

  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  set fixedHeader(value) {
    SettingsModule.ChangeSetting({ key: 'fixedHeader', value })
  }

  get showNavar() {
    return SettingsModule.showNavar
  }

  set showNavar(val: boolean | undefined) {
    SettingsModule.ChangeSetting({
      key: 'showNavar',
      value: val
    })
  }

  get showMenu() {
    return SettingsModule.showMenu
  }

  set showMenu(val: boolean | undefined) {
    SettingsModule.ChangeSetting({
      key: 'showMenu',
      value: val
    })
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  set showTagsView(value) {
    SettingsModule.ChangeSetting({ key: 'showTagsView', value })
  }

  get showSidebarLogo() {
    return SettingsModule.showSidebarLogo
  }

  set showSidebarLogo(value) {
    SettingsModule.ChangeSetting({ key: 'showSidebarLogo', value })
  }

  get sidebarTextTheme() {
    return SettingsModule.sidebarTextTheme
  }

  set sidebarTextTheme(value) {
    SettingsModule.ChangeSetting({ key: 'sidebarTextTheme', value })
  }

  get showContextMenu(): boolean {
    return SettingsModule.showContextMenu!
  }

  set showContextMenu(value: boolean) {
    SettingsModule.ChangeSetting({
      key: 'showContextMenu',
      value: value
    })
  }

  get supportPinyinSearch(): boolean {
    return SettingsModule.supportPinyinSearch
  }

  set supportPinyinSearch(value: boolean) {
    SettingsModule.ChangeSetting({
      key: 'supportPinyinSearch',
      value: value
    })
  }

  get lang(): string {
    return this.$store.getters.language
  }

  private themeChange(value: string) {
    SettingsModule.ChangeSetting({ key: 'theme', value })
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
