<template>
  <div
    ref="rightMenu"
    :class="{show: isShowRightPanel}"
    class="rightMenu-container"
  >
    <div class="setting">
      <div class="showme">
        <!-- <div class="rightMenu-background" /> -->
        <div class="rightMenu">
          <div
            class="handle-button"
            :style="{'top': buttonTop+'px','background-color': theme}"
            @click="closePanel"
          >
            <i :class="icon" style="color: white;" />
          </div>

          <div class="rightMenu-items">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.setting {
  z-index: 3;
  width: 2.5%;
  height: 10%;
  right: 0%;
  position: absolute;
  top: 250px;
}
.showme {
  display: block;
}

.setting:hover .showme {
  display: block;
}
.showrightMenu {
  overflow: visible;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightMenu-background {
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  position: fixed;
  z-index: -1;
}

.rightMenu {
  background: #fff;
  z-index: 3000;
  position: fixed;
  height: 100vh;
  width: 100%;
  max-width: 80%;
  top: 0px;
  left: 0px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  z-index: 40000;
  left: auto;
  right: 0px;
}

.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightMenu-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightMenu {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
