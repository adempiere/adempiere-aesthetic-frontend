<template>
  <div
    id="header-search"
    :class="{'show': show}"
    class="header-search"
  >
    <svg-icon
      class="search-icon"
      name="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      :placeholder="$t('table.dataTable.search')"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="element in options"
        :key="element.item.path"
        :value="element.item"
        :label="element.item.meta.title.join(' > ')"

      >
      <svg-icon :name="element.item.meta.icon" style="margin-right: 5px;"/>
      {{ element.item.meta.title.join(' > ') }}
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import path from 'path'
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import MixinI18n from '@/ADempiere/shared/utils/i18n'
import { DeviceType } from '@/ADempiere/modules/app/AppType'
// import i18n from '@/ADempiere/shared/lang' // Internationalization

@Component({
  name: 'HeaderSearch',
  mixins: [MixinI18n]
})
export default class extends Mixins(MixinI18n) {
  private search = ''
  private show = false
  private options: Fuse.FuseResult<RouteConfig>[] = []
  private searchPool: RouteConfig[] = []
  private fuse?: Fuse<RouteConfig>

  get isMobile() {
    return this.$store.state.app.device === DeviceType.Mobile
  }

  get routes() {
    return this.$store.state.permission.routes
  }

  get lang() {
    return this.$store.state.app.language
  }

  get supportPinyinSearch() {
    return this.$store.state.settings.supportPinyinSearch
  }

  @Watch('lang')
  private onLangChange() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  @Watch('routes')
  private onRoutesChange() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  @Watch('searchPool')
  private onSearchPoolChange(value: any[]) {
    this.initFuse(value)
  }

  @Watch('show')
  private onShowChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.close)
    } else {
      document.body.removeEventListener('click', this.close)
    }
  }

  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  private click() {
    this.show = !this.show
    if (this.show) {
      this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
    }
  }

  private close() {
    this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
    this.options = []
    this.show = false
  }

  change(route: RouteConfig) {
    if (route.name) {
      const query: any = {}
      if (route.meta && route.meta.type === 'window') {
        query.tabParent = 0
      }

      this.$router.push({
        name: route.name,
        params: {
          childs: route.meta.childs
        },
        query
      })
    } else {
      this.$router.push({
        path: route.path
      })
    }

    // this.$router.push(route.path)
    this.search = ''
    this.options = []
    this.$nextTick(() => {
      this.show = false
    })
  }

  private initFuse(list: RouteConfig[]) {
    this.fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      keys: [{
        name: 'meta.title',
        weight: 0.7
      }, {
        name: 'pinyinTitle',
        weight: 0.3
      }, {
        name: 'path',
        weight: 0.3
      }]
    })
  }

  // Filter out the routes that can be displayed in the sidebar
  // And generate the internationalized title
  private generateRoutes(routes: RouteConfig[], basePath = '/', prefixTitle: string[] = []): RouteConfig[] {
    let res: RouteConfig[] = []

    for (const router of routes) {
      // skip hidden router
      // if (router.meta && router.meta.hidden) {
      //   continue
      // }

      const data: RouteConfig = {
        path: path.resolve(basePath, router.path),
        meta: {
          ...router.meta,
          title: [...prefixTitle]
        },
        name: router.name
      }

      if (router.meta && router.meta.title) {
        // generate internationalized title
        const i18ntitle = this.generateTitle(router.meta.title)
        data.meta.title = [...data.meta.title, i18ntitle]
        if (router.redirect !== 'noRedirect' && router.name !== 'Report Viewer' && !router.meta.isIndex) {
          // only push the routes with title
          // special case: need to exclude parent router without redirect
          res.push(data)
        }
      }

      // recursive child routes
      if (router.children) {
        const tempRoutes = this.generateRoutes(router.children, data.path, data.meta.title)
        if (tempRoutes.length >= 1) {
          res = [...res, ...tempRoutes]
        }
      }
    }
    return res
  }

  private querySearch(query?: string) {
    if (query && query !== '') {
      if (this.fuse) {
        this.options = this.fuse.search(query)
      }
    } else {
      this.options = []
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 150px;
      margin-left: 10px;
    }
  }
}
</style>
