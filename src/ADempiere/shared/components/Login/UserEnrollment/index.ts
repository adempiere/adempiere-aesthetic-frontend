import { IEnrollUserParams } from '@/ADempiere/modules/enrollment'
import { requestEnrollUser } from '@/ADempiere/modules/enrollment/EnrollmentService'
import { ElInput } from 'element-ui/types/input'
import { Component, Mixins } from 'vue-property-decorator'
import MixinLogin from '../MixinLogin'
import Template from './template.vue'

@Component({
  name: 'UserEnrollment',
  mixins: [Template, MixinLogin]
})
export default class UserEnrollment extends Mixins(MixinLogin) {
    public passwordConfirm?: ElInput
    public loading = false
    public passwordType = 'password'
    public passwordConfirmType = 'password'
    public capsTooltip = false
    public isShowPassword = false
    public capsTooltipNew = false
    public eMailPattern = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{1,})$/i

    public enrollmentUserForm = {
      name: '',
      userName: '',
      eMail: '',
      password: '',
      passwordConfirm: ''
    }

      private validateField = (rule: any, value: any, callback: Function) => {
        if (!value) {
          callback(new Error(this.$t('notifications.fieldMandatory').toString()))
        } else {
          callback()
        }
      }

      private validateEmail = (rule: any, value: any, callback: Function) => {
        if (!this.eMailPattern.test(value)) {
          callback(new Error(this.$t('notifications.invalidEmailFormat').toString()))
        } else {
          callback()
        }
      }

      private validatePass = (rule: any, value: any, callback: Function) => {
        if (value && this.isShowPassword) {
          callback(new Error(this.$t('notifications.fieldMandatory').toString()))
        } else {
          callback()
        }
      }

      private validateNewPass = (rule: any, value: any, callback: Function) => {
        if (value && this.isShowPassword) {
          callback(new Error(this.$t('notifications.fieldMandatory').toString()))
        } else if (value !== this.enrollmentUserForm.password) {
          callback(new Error(this.$t('login.passwordAndConfirmNotMatch').toString()))
        } else {
          callback()
        }
      }

      public passwordResetRules = {
        name: [{ validator: this.validateField, trigger: 'blur' }],
        userName: [{ validator: this.validateField, trigger: 'blur' }],
        eMail: [
          { validator: this.validateField, trigger: 'blur' },
          { validator: this.validateEmail, trigger: 'blur' }
        ],
        password: [{ validator: this.validatePass, trigger: 'blur' }],
        passwordConfirm: [{ validator: this.validateNewPass, trigger: 'blur' }]
      }

      // Computed properties
      get isReadyFormSubmit(): boolean {
        const { name, userName, eMail, password, passwordConfirm } = this.enrollmentUserForm
        if (!name) {
          return false
        }
        if (!userName) {
          return false
        }
        if (!eMail || !this.eMailPattern.test(eMail)) {
          return false
        }
        if (this.isShowPassword) {
          if (!password) {
            return false
          }
          if (password !== passwordConfirm) {
            return false
          }
        }
        return true
      }

      // Methods
      checkCapslock(params: { shiftKey?: any, key?: string }, isNew = false): void {
        params = params || {}
        const { shiftKey, key } = params
        let capsLock = false
        if (key && key.length === 1) {
          const checkBeforeA = shiftKey && (key >= 'a' && key <= 'z')
          const checkBeforeB = !shiftKey && (key >= 'A' && key <= 'Z')
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

      handleSubmit() {
        if (this.isReadyFormSubmit) {
          this.loading = true
          const dataToSubmit: Partial<IEnrollUserParams> = {
            name: this.enrollmentUserForm.name,
            userName: this.enrollmentUserForm.userName,
            eMail: this.enrollmentUserForm.eMail
          }
          if (this.isShowPassword) {
            dataToSubmit.password = this.enrollmentUserForm.password
          }
          requestEnrollUser(<IEnrollUserParams>dataToSubmit)
            .then(() => {
              this.$message({
                message: this.$t('login.userEnrollmentSuccessful').toString(),
                showClose: true,
                type: 'success'
              })

              this.pathRedirect()
            })
            .catch(error => {
              this.$message({
                message: error.message,
                // message: this.$t('login.unexpectedError'),
                showClose: true,
                type: 'error'
              })
              console.warn(`Enrollment User - Error ${error.code}: ${error.message}`)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      }
}
