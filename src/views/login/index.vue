<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
        >
            <el-row>
                <el-col :span="3">
                    <img
                        src="https://avatars1.githubusercontent.com/u/1263359?s=200&v=4"
                        class="image"
                    />
                </el-col>

                <el-col :span="20">
                    <div class="title-container">
                        <h3 class="title">
                            {{ $t('login.title').toString() }}
                        </h3>
                        <lang-select class="set-language" />
                    </div>
                </el-col>
            </el-row>

            <el-form-item prop="userName">
                <span class="svg-container">
                    <svg-icon name="user" />
                </span>
                <el-input
                    ref="userName"
                    v-model="loginForm.userName"
                    :placeholder="$t('login.userName').toString()"
                    name="userName"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                />
            </el-form-item>

            <el-tooltip
                v-model="capsTooltip"
                content="$t('login.capsLock')"
                placement="right"
                manual
            >
                <el-form-item prop="password">
                    <span class="svg-container">
                        <svg-icon name="password" />
                    </span>
                    <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        :placeholder="$t('login.password').toString()"
                        name="password"
                        tabindex="2"
                        autocomplete="on"
                        @keyup.native="checkCapslock"
                        @blur="capsTooltip = false"
                        @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon
                            :name="
                                passwordType === 'password'
                                    ? 'eye-off'
                                    : 'eye-on'
                            "
                        />
                    </span>
                </el-form-item>
            </el-tooltip>

            <el-button
                :loading="loading"
                type="primary"
                style="width:100%"
                @click.native.prevent="handleLogin"
            >
                {{ $t('login.logIn').toString() }}
            </el-button>

            <el-button
                type="text"
                style="float: left"
                @click.native.prevent="pathRedirect('forgotPassword')"
                >
                {{ $t('route.forgotPassword') }}
            </el-button>

            <el-button
                type="text"
                style="float: right"
                @click.native.prevent="pathRedirect('userEnrollment')"
                >
                {{ $t('route.userEnrollment') }}
            </el-button>

            <div>
                <div class="tips">
                    <span />
                    <span />
                </div>
                <div class="tips">
                    <span />
                    <span />
                </div>
            </div>
        </el-form>

        <el-dialog
            :title="$t('login.thirdparty').toString()"
            :visible.sync="showDialog"
        >
            {{ $t('login.thirdpartyTips') }}
            <br />
            <br />
            <br />
            <social-sign />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import MixinLogin from '@/ADempiere/shared/components/Login/MixinLogin'
import SocialSign from './components/SocialSignin.vue'

@Component({
  name: 'Login',
  mixins: [MixinLogin],
  components: {
    SocialSign
  }
})
export default class extends Vue {
    private validateUsername = (
      rule: any,
      value: string,
      callback: Function
    ) => {
      if (value.trim().length < 1) {
        callback(new Error(this.$t('login.noValidUser').toString()))
      } else {
        callback()
      }
    }

    private validatePassword = (
      rule: any,
      value: string,
      callback: Function
    ) => {
      if (value.length < 1) {
        callback(new Error(this.$t('login.noValidPassword').toString()))
      } else {
        callback()
      }
    }

    private loginForm = {
      userName: '',
      password: '',
      // Adempiere
      roleUuid: '',
      organizationUuid: '',
      token: ''
    }

    private loginRules = {
      userName: [{ validator: this.validateUsername, trigger: 'blur' }],
      password: [{ validator: this.validatePassword, trigger: 'blur' }]
    }

    private passwordType = 'password'
    private loading = false
    private showDialog = false
    private capsTooltip = false
    private redirect?: string
    private otherQuery: Dictionary<string> = {}

    @Watch('$route', { immediate: true })
    private onRouteChange(route: Route) {
      // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
      // See https://github.com/vuejs/vue-router/pull/2050 for details
      const query = route.query as Dictionary<string>
      if (query) {
        this.redirect = query.redirect
        this.otherQuery = this.getOtherQuery(query)
      }
    }

    mounted() {
      if (this.loginForm.userName === '') {
        (this.$refs.userName as Input).focus()
      } else if (this.loginForm.password === '') {
        (this.$refs.password as Input).focus()
      }
    }

    private checkCapslock(e: KeyboardEvent) {
      const { key } = e
      this.capsTooltip =
            key !== null && key.length === 1 && key >= 'A' && key <= 'Z'
    }

    // private showPwd() {
    //     if (this.passwordType === 'password') {
    //         this.passwordType = ''
    //     } else {
    //         this.passwordType = 'password'
    //     }
    //     this.$nextTick(() => {
    //         (this.$refs.password as Input).focus()
    //     })
    // }

    private handleLogin() {
      (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
        const expr = '/'
        const query = (this.$route.query.redirect as string)
        if (query) {
          this.loginForm = {
            ...this.loginForm,
            roleUuid: this.clientIdRedirect(query, expr),
            organizationUuid: this.organizationIdRedirect(query, expr)
          }
        }

        if (valid) {
          this.loading = true

          await UserModule.Login(this.loginForm)
            .then((res) => {
              // this.$router.push({
              //   path: this.redirect || '/',
              //   query: this.otherQuery
              // })
              this.$store.dispatch('setRouter', this.$router)
              location.reload()
            })
            .catch(error => {
              let message: string = this.$t(
                'login.unexpectedError'
              ).toString()
              if ([13, 500].includes(error.code)) {
                message = this.$t('login.invalidLogin').toString()
              }

              this.$message.error(message)
            })
            .finally(() => {
              this.loading = false
            })

          // Just to simulate the time of the request
          // setTimeout(() => {
          //     this.loading = false
          // }, 0.5 * 1000)
        } else {
          return false
        }
      })
    }

    private getOtherQuery(query: Dictionary<string>) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {} as Dictionary<string>)
    }

    // private pathRedirect(path = 'login') {
    //     this.$router
    //         .push({
    //             path
    //         })
    //         .catch(error => {
    //             console.info(`Login Mixin: ${error.name}, ${error.message}`)
    //         })
    // }

    private clientIdRedirect(query: string, expr: string): string {
      const redirect = query.split(expr)
      return redirect[1]
    }

    private organizationIdRedirect(query: string, expr: string): string {
      const redirect = query.split(expr)
      return redirect[2]
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 10px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
