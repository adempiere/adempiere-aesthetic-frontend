import { ElInput } from 'element-ui/types/input'
import { Component, Ref, Vue } from 'vue-property-decorator'
import LangSelect from '@/components/LangSelect/index.vue'

@Component({
  name: 'MixinLogin',
  components: {
    LangSelect
  }
})
export default class MixinLogin extends Vue {
    public passwordType = ''
    @Ref() password?: ElInput
    // Methods
    public showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        if (this.password) {
          this.password.focus()
        }
      })
    }

    public pathRedirect(path = 'login') {
      this.$router.push({
        path
      }).catch(error => {
        console.info(`Login Mixin: ${error.name}, ${error.message}`)
      })
    }
}
