import { IForgotPasswordResponse } from '@/ADempiere/modules/enrollment'
import { requestChangePassword } from '@/ADempiere/modules/enrollment/EnrollmentService'
import { ElInput } from 'element-ui/types/input'
import { Component, Mixins, Ref } from 'vue-property-decorator'
import MixinLogin from '../MixinLogin'

@Component({
  name: 'ChangePassword',
  mixins: [MixinLogin]
})
export default class ChangePassword extends Mixins(MixinLogin) {
    @Ref() passwordConfirm?: ElInput
    public loading = false
    public passwordType = 'password'
    public passwordConfirmType = 'password'
    public capsTooltip = false
    public capsTooltipNew = false

    private validatePass = (rule: any, value: any, callback: Function) => {
      if (!value) {
        callback(
          new Error(this.$t('notifications.fieldMandatory').toString())
        )
      } else {
        callback()
      }
    }

    private validateNewPass = (rule: any, value: any, callback: Function) => {
      if (!value) {
        callback(
          new Error(this.$t('notifications.fieldMandatory').toString())
        )
      } else if (value !== this.changePasswordForm.password) {
        callback(
          new Error(
            this.$t('login.passwordAndConfirmNotMatch').toString()
          )
        )
      } else {
        callback()
      }
    }

    public changePasswordForm = {
      password: '',
      passwordConfirm: ''
    }

    public passwordResetRules = {
      password: [{ validator: this.validatePass, trigger: 'blur' }],
      passwordConfirm: [{ validator: this.validateNewPass, trigger: 'blur' }]
    }

    // Computed properties
    get formName(): string | null | undefined {
      return this.$route.name
    }

    get isDisabled(): boolean {
      if (!this.changePasswordForm.password) {
        return true
      }
      if (this.changePasswordForm.password !== this.changePasswordForm.passwordConfirm) {
        return true
      }
      return false
    }

    // Methods
    checkCapslock(params: { shiftKey?: any, key?: string }, isNew = false): void {
      params = params || {}
      const { shiftKey, key } = params
      let capsLock = false
      if (key && key.length === 1) {
        const checkBeforeA: boolean = shiftKey && (key >= 'a' && key <= 'z')
        const checkBeforeB: boolean = !shiftKey && (key >= 'A' && key <= 'Z')
        if (checkBeforeA || checkBeforeB) {
          capsLock = true
        } else {
          capsLock = false
        }
      }
      if (key === 'CapsLock' && capsLock === true) {
        capsLock = false
      }
      if (isNew) {
        this.capsTooltipNew = capsLock
      } else {
        this.capsTooltip = capsLock
      }
    }

    checkCapslockNew(params: { shiftKey?: any, key?: string }, isNew = true): void {
      params = params || {}
      const { shiftKey, key } = params
      this.checkCapslock({ shiftKey, key }, true)
    }

    showPasswordConfirm(): void {
      if (this.passwordConfirmType === 'password') {
        this.passwordConfirmType = ''
      } else {
        this.passwordConfirmType = 'password'
      }
      this.$nextTick(() => {
        if (this.passwordConfirm) {
          this.passwordConfirm.focus()
        }
      })
    }

    handleSubmit(): void {
      if (this.changePasswordForm.password && this.changePasswordForm.passwordConfirm) {
        this.loading = true
        this.createPasswordFromToken({
          token: <string> this.$route.query.token,
          password: this.changePasswordForm.password
        })
      }
    }

    createPasswordFromToken(params: {
        token: string
        password: string
      }) {
      const { token, password } = params
      requestChangePassword({
        token: token,
        password: password
      })
        .then((createPasswordResponse: IForgotPasswordResponse) => {
          if (createPasswordResponse.responseType === 'OK') {
            this.$message({
              message: this.$t('login.createPasswordSuccessful').toString(),
              showClose: true,
              type: 'success'
            })
          } else {
            this.$message({
              message: this.$t('login.unexpectedError').toString(),
              showClose: true,
              type: 'error'
            })
          }

          this.pathRedirect()
        })
        .catch(error => {
          this.$message({
            message: this.$t('login.unexpectedError').toString(),
            showClose: true,
            type: 'error'
          })
          console.warn(`Create Password - Error ${error.code}: ${error.message}`)
        })
        .finally(() => {
          this.loading = false
        })
    }

    verifyToken(): boolean {
      if (this.$route.query && this.$route.query.token) {
        return true
      }
      this.$message.error(this.$t('login.invalidToken').toString())
      this.pathRedirect()
      return false
    }
}
