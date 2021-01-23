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
                <header-search id="header-search" class="right-menu-item" />
                <badge />
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
import { AppModule, DeviceType } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
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

    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    get sidebar() {
      return AppModule.sidebar
    }

    get device(): string {
      console.log(AppModule.device)
      if (this.isMobile) {
        return 'mobile'
      }
      return 'desktop'
    }

    get avatar() {
      return UserModule.avatar
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

    // Methods
    private handleOpen(key: any, keyPath: any) {
      console.log(key, keyPath)
    }

    private handleClose(key: any, keyPath: any) {
      console.log(key, keyPath)
    }

    private isMenuOption() {
      this.isMenuMobile = !this.isMenuMobile
    }

    private toggleSideBar() {
      AppModule.ToggleSideBar(false)
    }

    private async logout() {
      await UserModule.LogOut()
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

    public handleClick() {
      this.$router.push({
        name: 'Profile'
      })
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
