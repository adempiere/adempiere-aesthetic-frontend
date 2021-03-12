<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div>
      <svg-icon
        name="language"
        class="international-icon"
      />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="language==='zh'"
        command="zh"
      >
        中文
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='en'"
        command="en"
      >
        English
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='es'"
        command="es"
      >
        Español
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='ja'"
        command="ja"
      >
        日本語
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='ko'"
        command="ko"
      >
        한국어
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='it'"
        command="it"
      >
        Italiano
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'Login'
})
export default class extends Vue {
  get language() {
    return this.$store.state.app.language
  }

  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang
    this.$store.dispatch(Namespaces.App + '/' + 'SetLanguage', lang)
    if (this.$route.path !== '/login') {
      location.reload()
    }
    this.$message({
      message: this.$t('components.changeLanguageTips').toString(),
      type: 'success'
    })
  }
}
</script>
