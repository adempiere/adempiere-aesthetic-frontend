<template>
  <div>
    <div style="margin-bottom:15px;">
      {{ $t('permission.roles') }}： {{ roles }}
    </div>
    {{ $t('permission.switchRoles') }}：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SwitchRoles'
})
export default class extends Vue {
  get roles() {
    return this.$store.state.user.roles
  }

  get switchRoles() {
    return this.roles[0]
  }

  set switchRoles(value) {
    this.$store.dispatch(Namespaces.User + '/' + 'ChangeRoles', value).then(() => {
      this.$emit('change')
    })
  }
}
</script>
