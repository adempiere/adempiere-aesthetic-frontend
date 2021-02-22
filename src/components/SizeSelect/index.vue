<template>
  <el-dropdown
    id="size-select"
    trigger="click"
    @command="handleSetSize"
  >
    <div>
      <svg-icon
        class="size-icon"
        name="size"
      />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size===item.value"
        :command="item.value"
      >
        {{
          item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SizeSelect'
})
export default class extends Vue {
  private sizeOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Medium', value: 'medium' },
    { label: 'Small', value: 'small' },
    { label: 'Mini', value: 'mini' }
  ]

  get size() {
    return this.$store.state.app.size
  }

  private handleSetSize(size: string) {
    (this as any).$ELEMENT.size = size
    this.$store.dispatch(Namespaces.App + '/' + 'SetSize', size)
    this.refreshView()
    this.$message({
      message: 'Switch Size Success',
      type: 'success'
    })
  }

  private refreshView() {
    // In order to make the cached page re-rendered
    this.$store.dispatch(Namespaces.TagsView + '/' + 'delAllCachedViews')
    const { fullPath } = this.$route
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  }
}
</script>
