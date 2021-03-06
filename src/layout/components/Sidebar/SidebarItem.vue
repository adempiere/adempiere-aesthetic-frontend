<template>
  <div
    v-if="item.meta && !item.meta.hidden"
    :class="[isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}]"
  >
    <template v-if="isNotParent">
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="theOnlyOneChild"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :route="item"
          :class="{'submenu-title-noDropdown': isFirstLevel}"
          @click="openItemMenu"
        >
          <svg-icon
            v-if="theOnlyOneChild.meta.icon"
            :name="theOnlyOneChild.meta.icon"
          />
          <span
            v-if="theOnlyOneChild.meta.title"
            slot="title"
          >{{ ($te('route.'+item.meta.title)) ? $t('route.'+item.meta.title) : item.meta.title }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu
      v-else
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template v-if="item.meta && item.meta.title && item.meta.icon" slot="title">
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :name="item.meta.icon"
        />
        <span
          v-if="item.meta && item.meta.title"
          slot="title"
        >{{ ($te('route.'+item.meta.title)) ? $t('route.'+item.meta.title) : item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'

@Component({
  // Set 'name' here to prevent uglifyjs from causing recursive component not work
  // See https://medium.com/haiiro-io/element-component-name-with-vue-class-component-f3b435656561 for detail
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  }
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig
  @Prop({ default: false }) private isCollapse!: boolean
  @Prop({ default: true }) private isFirstLevel!: boolean
  @Prop({ default: '' }) private basePath!: string
  private noShowingChildren = false

  get alwaysShowRootMenu() {
    if (this.item.meta && this.item.meta.alwaysShow) {
      return true
    }
    return false
  }

  get isNotParent(): boolean {
    const hasOneshowingChild: boolean = this.showingChildNumber === 1 || this.showingChildNumber === 0
    const hasOnlyOne: boolean = (this.theOnlyOneChild !== null) && !this.theOnlyOneChild.children
    const validation: boolean = hasOneshowingChild && (!this.theOnlyOneChild?.children || this.noShowingChildren || this.theOnlyOneChild === null)
    return validation
  }

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false
        } else {
          return true
        }
      })
      if (showingChildren.length === 0) {
        this.noShowingChildren = true
      }
      return showingChildren.length
    }
    return 0
  }

  get theOnlyOneChild(): RouteConfig {
    if (this.showingChildNumber > 1) {
      return {
        ...this.item,
        path: '',
        meta: {
          noShowingChildren: true
        }
      }
    }
    if (this.item.children) {
      for (const child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child
        }
      }
    }
    // If there is no children, return itself with path removed,
    // because this.basePath already conatins item's path information
    return { ...this.item, path: '' }
  }

  /**
     * Clear field values, and set default values with open
     * @param menuItem router item with meta attributes
     */
  openItemMenu(menuItem: any): void {
    const view: RouteConfig = menuItem._props.route
    if (view.meta && view.meta.uuid && view.meta.type) {
      const {
        parentUuid,
        uuid: containerUuid,
        type: panelType
      } = view.meta
      if (panelType !== PanelContextType.Window) {
        this.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
          parentUuid,
          containerUuid,
          panelType,
          isNewRecord: false
        })
        if ([PanelContextType.Browser].includes(panelType)) {
          this.$store.dispatch(Namespaces.BusinessData + '/' + 'deleteRecordContainer', {
            viewUuid: containerUuid
          })
        }
      }
    }
  }

  private resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }
}
</script>

<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.full-mode {
  .nest-menu .el-submenu>.el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      &>.el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        &>span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
