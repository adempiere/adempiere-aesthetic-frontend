import { IForgotPasswordResponse } from '@/ADempiere/modules/enrollment'
import { requestForgotPassword } from '@/ADempiere/modules/enrollment/EnrollmentService'
import { Component, Mixins } from 'vue-property-decorator'
import MixinLogin from '../MixinLogin'
import Template from './template.vue'

@Component({
  name: 'ForgotPassword',
  mixins: [Template, MixinLogin]
})
export default class ForgotPassword extends Mixins(MixinLogin) {
    private loading = false
    private forgotForm = {
      userName: ''
    }

    private forgotRules = {
      userName: [{ required: true, trigger: 'blur' }]
    }

    // Methods
    handleSubmit(): void {
      if (this.forgotForm.userName) {
        this.loading = true
        requestForgotPassword(this.forgotForm.userName)
          .then((forgotPasswordResponse: IForgotPasswordResponse) => {
            if (forgotPasswordResponse.responseType === 'OK') {
              this.$message({
                message: this.$t('login.passwordResetSendLink') + this.forgotForm.userName,
                showClose: true,
                type: 'success'
              })

              this.pathRedirect()
            } else {
              this.$message({
                message: this.$t('login.unexpectedError').toString(),
                showClose: true,
                type: 'error'
              })
            }
          })
          .catch(error => {
            this.$message({
              message: this.$t('login.unexpectedError').toString(),
              showClose: true,
              type: 'error'
            })
            console.warn(`Forgot Password - Error ${error.code}: ${error.message}`)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
}
