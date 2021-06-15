<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggle-click="toggleSideBar"
        />
        <el-button
            v-if="isMenuMobile && isMobile"
            type="text"
            icon="el-icon-close"
            style="
                padding-top: 13px;
                color: #000000;
                font-size: 121%;
                font-weight: 615 !important;
            "
            @click="isMenuOption()"
        />
        <breadcrumb
            v-show="!isMenuMobile || this.device !== 'mobile'"
            id="breadcrumb-container"
            class="breadcrumb-container"
            :style="isMobile ? {width: '40%'} : {width: 'auto'}"
        />
        <div
            v-show="isMenuMobile && isMobile"
            style="display: inline-flex; float: right"
        >
            <header-search
                id="header-search"
                class="right-menu-item"
                style="padding-top: 10px"
            />
            <badge style="padding-top: 6px" />
        </div>

        <div class="right-menu">
            <template v-if="this.device !== 'mobile'">
                <el-tooltip :content="$t('route.guide')" placement="top-start">
                <el-button icon="el-icon-info" type="text" style="color: black;font-size: larger" @click.prevent.stop="guide" />
                </el-tooltip>
                <header-search id="header-search" class="right-menu-item" />
                <badge id="badge-navar" />
                <error-log
                    class="errLog-container right-menu-item hover-effect"
                />
                <screenfull
                    id="screenfull"
                    class="right-menu-item hover-effect"
                />

                <el-tooltip
                    :content="$t('navbar.size')"
                    effect="dark"
                    placement="bottom"
                >
                    <size-select
                        id="size-select"
                        class="right-menu-item hover-effect"
                    />
                </el-tooltip>

                <lang-select class="right-menu-item hover-effect" />
            </template>

            <el-button
                v-show="!isMenuMobile && isMobile"
                type="text"
                icon="el-icon-more"
                @click="isMenuOption()"
            >
            </el-button>

            <el-popover placement="bottom" width="245" trigger="click">
                <div>
                    <profile-preview :user="user" :avatar="avatar" />
                    <el-button
                        type="text"
                        style="float: left"
                        @click="handleClick"
                        >{{ $t('navbar.profile') }}</el-button
                    >
                    <el-button
                        type="text"
                        style="float: right"
                        @click="logout"
                        >{{ $t('navbar.logOut') }}</el-button
                    >
                </div>
                <el-button
                    slot="reference"
                    type="text"
                    style="padding-top: 0px"
                >
                    <img :src="avatarResize" class="user-avatar" />
                </el-button>
            </el-popover>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import ProfilePreview from '@/layout/components/ProfilePreview'
import Badge from '@/ADempiere/shared/components/Badge/component'
import { getImagePath } from '@/ADempiere/shared/utils/resource'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import Driver, { Step } from 'driver.js'
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps, { IStepData } from '@/ADempiere/shared/components/Form/VPOS/Guide/steps'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { IUserState } from '@/ADempiere/modules/user'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { IWindowDataExtended } from '@/ADempiere/modules/dictionary'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Badge,
    ErrorLog,
    Hamburger,
    HeaderSearch,
    LangSelect,
    Screenfull,
    SizeSelect,
    ProfilePreview
  }
})
export default class extends Vue {
    public user: any = {}
    public isMenuMobile = false
    public driver: Driver | null = null

    get isMobile(): boolean {
      return (this.$store.state.app as IAppState).device === DeviceType.Mobile
    }

    get isShowedPOSKeyLaout(): boolean {
      return this.$store.getters[Namespaces.PointOfSales + '/' + 'getShowPOSKeyLayout']
    }

    get showCollection(): boolean {
      return this.$store.getters[Namespaces.PointOfSales + '/' + 'getShowCollectionPos']
    }

    get showGuide(): boolean {
      const typeViews = this.$route.meta.type
      if (!isEmptyValue(typeViews) && typeViews !== PanelContextType.Window) {
        return true
      }
      return false
    }

    get sidebar() {
      return (this.$store.state.app as IAppState).sidebar
    }

    get device(): string {
      if (this.isMobile) {
        return 'mobile'
      }
      return 'desktop'
    }

    get avatar() {
      return (this.$store.state.user as IUserState).avatar
    }

    get avatarResize(): string {
      if (!this.avatar) {
        return 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/80/h/80'
      }

      const { uri } = getImagePath({
        file: this.avatar,
        width: 40,
        height: 40
      })

      return uri
    }

    get fieldPanel(): IFieldDataExtendedUtils[] {
      return (this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListFromPanel'](this.$route.meta.uuid) as IFieldDataExtendedUtils[]).filter(field => field.isShowedFromUser)
    }

    get fieldWindow(): IFieldDataExtendedUtils[] {
      const windowUuid: string = (this.$store.getters[Namespaces.WindowDefinition + '/' + 'getWindow'](this.$route.meta.uuid) as IWindowDataExtended).currentTab.uuid
      const list: IFieldDataExtendedUtils[] = this.$store.getters[Namespaces.Payments + '/' + 'getFieldsListFromPanel'](windowUuid) as IFieldDataExtendedUtils[]
      if (!isEmptyValue(list)) {
        return list.filter(field => field.isShowedFromUserDefault)
      }
      return []
    }

    // Methods
    private isMenuOption() {
      this.isMenuMobile = !this.isMenuMobile
    }

    private toggleSideBar() {
      this.$store.dispatch(Namespaces.App + '/' + 'ToggleSideBar', false)
    }

    private async logout() {
      await this.$store.dispatch(Namespaces.User + '/' + 'LogOut')
      this.$router.push({
        path: '/login'
      })

      // this.$router.push(`/login?redirect=${this.$route.fullPath}`,
      // () => {
      //   this.$router.push({
      //     name: 'Profile'
      //   })
      // })
    }

    private guide() {
      const value: Step[] = this.formatGuide(this.$route.meta.type)!
      this.driver!.defineSteps(value)
      this.driver!.start()
    }

    private formatGuide(type: PanelContextType): Step[] | undefined {
      let field
      switch (type) {
        case 'report':
          field = this.fieldPanel.map(steps => {
            return {
              element: '#' + steps.columnName,
              popover: {
                title: steps.name,
                description: steps.description,
                position: 'top'
              }
            }
          })
          break
        case 'process':
          field = this.fieldPanel.map(steps => {
            return {
              element: '#' + steps.columnName,
              popover: {
                title: steps.name,
                description: steps.description,
                position: 'top'
              }
            }
          })
          break
        case 'window':
          field = this.fieldWindow.map(steps => {
            return {
              element: '#' + steps.columnName,
              popover: {
                title: steps.name,
                description: steps.description,
                position: 'top'
              }
            }
          })
          break
        case 'form':
          field = this.showCollection && this.isShowedPOSKeyLaout ? steps : steps.filter(steps => isEmptyValue(steps.panel))
          break
      }
      return field
    }

    public handleClick() {
      this.$router.push({
        name: 'Profile'
      })
    }

    // Hooks
    mounted() {
      this.driver = new Driver()
    }
}
</script>

<style lang="scss" scoped>
.el-dropdown {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 14px;
    width: 50px;
}
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        padding: 0 15px;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        display: flex;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
