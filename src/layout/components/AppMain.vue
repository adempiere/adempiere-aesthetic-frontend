<template>
  <section id="appMain" class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  get openRoute() {
    return this.$store.state.utilsModule.openRoute
  }

  // Hooks
  created() {
    this.readRouteParameters()
  }

  // Methods
  public readRouteParameters(): void {
    if (this.$store.getters[Namespaces.Utils + '/' + 'getIsLoadedOpenRoute']) {
      return
    }
    this.$store.dispatch(Namespaces.Utils + '/' + 'setOpenRoute', {
      path: this.$route.path,
      name: this.$route.name,
      fullPath: this.$route.fullPath,
      params: {
        ...this.$route.params
      },
      query: {
        ...this.$route.query
      },
      isLoaded: true
    })
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
