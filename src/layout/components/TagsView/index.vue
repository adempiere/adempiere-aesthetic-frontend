<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
  >
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
    <draggable
    v-if="!isMobile"
    :list="visitedViews"
    v-bind="$attrs"
    :set-data="setData"
    style="display: flex;"
    >
    <router-link
    v-for="tag in visitedViews"
    ref="tag"
    :key="tag.path"
    :class="isActive(tag)?'active':''"
    :to="{
      name: tag.name,
    path: tag.path,
    query: tag.query,
    fullPath: tag.fullPath,
    params: tag.params
    }"
    tag="span"
    class="tags-view-item"
    @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
    @contextmenu.prevent.native="openMenu(tag,$event)"
    >
    <div class="tag-title">{{ generateTitle(tag.title) }}</div>
    <div v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
    </router-link>
    </draggable>
    <router-link
        v-for="tag in visitedViews"
        v-else
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{name: tag.name, path: tag.path, query: tag.query, fullPath: tag.fullPath, params: tag.params}"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ generateTitle(tag.title) }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
    </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{left: left+'px', top: top+'px'}"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        {{ $t('tagsView.refresh') }}
      </li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      >
        {{
          $t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">
        {{ $t('tagsView.closeOthers') }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        {{ $t('tagsView.closeAll') }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import ScrollPane from './ScrollPane.vue'
import MixinI18n from '@/ADempiere/shared/utils/i18n'
import draggable from 'vuedraggable'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { ITagView } from '@/ADempiere/modules/tagsView/TagsViewType'
import { DeviceType } from '@/ADempiere/modules/app/AppType'

@Component({
  name: 'TagsView',
  mixins: [MixinI18n],
  components: {
    ScrollPane,
    draggable
  }
})
export default class extends Mixins(MixinI18n) {
  private visible = false
  private top = 0
  private left = 0
  private selectedTag: ITagView = {}
  private affixTags: ITagView[] = []

  get isMobile(): boolean {
    return this.$store.state.app.device === DeviceType.Mobile
  }

  get visitedViews() {
    return this.$store.state.tagsView.visitedViews
  }

  get routes() {
    return this.$store.state.permission.routes
  }

  @Watch('$route')
  private onRouteChange() {
    this.addTags()
    this.moveToCurrentTag()
  }

  @Watch('visible')
  private onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  mounted() {
    this.initTags()
    this.addTags()
  }

  private isActive(route: ITagView) {
    if (route.name === 'Report Viewer') {
      const isSameProcess = route.params!.processId === this.$route.params.processId
      if (isSameProcess && route.params && route.params.tableName === this.$route.params.tableName) {
        return isSameProcess
      }
      return route.path === this.$route.path
    }
    return route.name === this.$route.name
  }

  private isAffix(tag: ITagView) {
    return tag.meta && tag.meta.affix
  }

  private filterAffixTags(routes: RouteConfig[], basePath = '/') {
    let tags: ITagView[] = []
    routes.forEach(route => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const childTags = this.filterAffixTags(route.children, route.path)
        if (childTags.length >= 1) {
          tags = [...tags, ...childTags]
        }
      }
    })
    return tags
  }

  private initTags() {
    // this.affixTags = this.filterAffixTags(this.routes)
    const affixTags = this.affixTags = this.filterAffixTags(this.routes)
    for (const tag of affixTags) {
      // Must have tag name
      if (tag.name) {
        this.$store.dispatch(Namespaces.TagsView + '/' + 'addVisitedView', tag)
      }
    }
  }

  private addTags() {
    const { name } = this.$route
    if (name) {
      this.$store.dispatch(Namespaces.TagsView + '/' + 'addView', this.$route)
    }
    return false
  }

  private moveToCurrentTag() {
    const tags = this.$refs.tag as any[] // TODO: better typescript support for router-link
    this.$nextTick(() => {
      for (const tag of tags) {
        if (this.$route.name === 'Report Viewer') {
          if (this.$route.params && tag.to && tag.to.params && tag.to.params.processId === this.$route.params.processId && tag.to.params.tableName === this.$route.params.tableName) {
            (this.$refs.scrollPane as ScrollPane).moveToTarget(tag as any)
          }
        }
        if ((tag.to as ITagView).name === this.$route.name) {
          if ((tag.to as ITagView).query && (tag.to as ITagView).query?.action && (tag.to as ITagView).query?.action === this.$route.query.action) {
            (tag.to as ITagView).params!.isReadParameters = (false as any)
          }
          (this.$refs.scrollPane as ScrollPane).moveToTarget(tag as any)
          // When query is different then update
          if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
            this.$store.dispatch(Namespaces.TagsView + '/' + 'updateVisitedView', this.$route)
          }
          break
        }
      }
    })
  }

  private refreshSelectedTag(view: ITagView) {
    this.$store.dispatch(Namespaces.TagsView + '/' + 'delCachedView', view)
    const { fullPath } = view
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      }).catch(err => {
        console.warn(err)
      })
    })
  }

  private closeSelectedTag(view: ITagView) {
    this.$store.dispatch(Namespaces.TagsView + '/' + 'delView', view)
    if (this.isActive(view)) {
      this.toLastView(this.$store.state.tagsView.visitedViews, view)
    }
    if (view.meta && view.meta.uuid && view.meta.type) {
      let parentUuid
      let containerUuid = view.meta.uuid
      if (view.meta.type === 'window') {
        parentUuid = view.meta.uuid
        containerUuid = view.meta.tabUuid
        this.$store.dispatch(Namespaces.Window + '/' + 'setWindowOldRoute')
      }

      this.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
        parentUuid,
        containerUuid,
        panelType: view.meta.type,
        isNewRecord: false
      })

      if (['window', 'browser'].includes(view.meta.type)) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'deleteRecordContainer', {
          viewUuid: view.meta.uuid
        })
      }
    }
  }

  private closeOthersTags() {
    if (this.selectedTag.fullPath !== this.$route.path && this.selectedTag.fullPath !== undefined) {
      this.$router.push(this.selectedTag.fullPath).catch(err => {
        console.warn(err)
      })
    }
    this.$store.dispatch(Namespaces.TagsView + '/' + 'delOthersViews', this.selectedTag)
    this.moveToCurrentTag()
  }

  private closeAllTags(view: ITagView) {
    this.$store.dispatch(Namespaces.TagsView + '/' + 'delAllViews')
    if (this.affixTags.some(tag => tag.path === this.$route.path)) {
      return
    }
    this.toLastView(this.$store.state.tagsView.visitedViews, view)
  }

  private toLastView(visitedViews: ITagView[], view: ITagView) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView !== undefined && latestView.fullPath !== undefined) {
      this.$router.push(latestView.fullPath).catch(err => {
        console.warn(err)
      })
    } else {
      // Default redirect to the home page if there is no tags-view, adjust it if you want
      if (view.name === 'Dashboard') {
        // to reload home page
        this.$router.replace({ path: '/redirect' + view.fullPath }).catch(err => {
          console.warn(err)
        })
      } else {
        this.$router.push('/').catch(err => {
          console.warn(err)
        })
      }
    }
  }

  private openMenu(tag: ITagView, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right
    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }
    this.top = e.clientY
    this.visible = true
    this.selectedTag = tag
  }

  private closeMenu() {
    this.visible = false
  }

  private setData(dataTransfer: any) {
    dataTransfer.setData('Text', '')
  }

  private handleScroll() {
    this.closeMenu()
  }
}
</script>

<style lang="scss">
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      align-self: center;
      min-width: 16px;
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    width: 100%;
    .tags-view-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      flex:none;
      max-width: 32%;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      padding: 0 7px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      div.tag-title{
        width: -webkit-fill-available;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:first-of-type {
        margin-left: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          align-self: center;
          min-width: 8px;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
