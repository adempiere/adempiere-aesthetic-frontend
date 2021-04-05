<template>
  <div id="app">
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'
import { Namespaces } from './ADempiere/shared/utils/types'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {
  // Methods
  getWindowWidth() {
    this.$store.dispatch(Namespaces.Utils + '/' + 'setWidth', document.documentElement.clientWidth)
  }

  getWindowHeight() {
    this.$store.dispatch(Namespaces.Utils + '/' + 'setHeight', document.documentElement.clientHeight)
  }

  // Hooks
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowWidth)
      window.addEventListener('resize', this.getWindowHeight)

      this.getWindowWidth()
      this.getWindowHeight()
    })
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth)
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>
