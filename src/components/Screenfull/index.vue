<template>
  <div id="screenfull">
    <svg-icon
      :name="isFullscreen? 'exit-fullscreen': 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

interface DocumentElement extends Document {
    mozCancelFullScreen?: () => Promise<void>
    webkitExitFullscreen?: () => Promise<void>
    mozFullScreenElement?: () => Promise<void>
    webkitFullscreenElement?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
}

@Component({
  name: 'Screenfull'
})
export default class extends Vue {
  private isFullscreen = false
  private elem: FullscreenHTMLElement = (document as DocumentElement).documentElement

  private click() {
    if (this.isFullscreen) {
      this.closeFullscreen()
      this.isFullscreen = true
      return this.isFullscreen
    }
    this.openFullscreen()
    this.isFullscreen = false
    return this.isFullscreen
  }

  private openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen()
    } else if (this.elem.webkitRequestFullscreen) {
      this.elem.webkitRequestFullscreen()
    } else if (this.elem.msRequestFullscreen) {
      this.elem.msRequestFullscreen()
    }
  }

  private closeFullscreen() {
    const doc = (document as DocumentElement)
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen()
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen()
    }
  }
}
</script>
