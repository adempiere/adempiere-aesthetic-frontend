<template>
  <h3 class="title-header text-center">
    <el-popover
      v-if="!isEmptyValue(help)"
      ref="helpTitle"
      placement="top-start"
      :title="title"
      :class="cssClassHelp"
      width="400"
      trigger="hover"
    >
      <div class="content-help" v-html="help" />
    </el-popover>

    <el-button
      v-popover:helpTitle
      type="text"
      class="container-title text-center"
    >
      {{ title }}
    </el-button>

    <slot />
  </h3>
</template>

<style>
  /* text content title */
  .el-popover__title {
    padding-top: 10px;
    padding-left: 10px;
  }
</style>
<style lang="scss" scoped>
  // title container
  .title-header {
    margin: 0px 0px !important;
    padding-top: 0px !important;
  }
  // text content help into popover
  .content-help {
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 0px !important;
    padding-bottom: 10px;
    word-break: break-word;
  }
  // title of the main views into popover
  .container-title {
    text-align: center;
    color: #000000;
    // text-size-adjust: 20px;
    font-size: 100%;
    font-weight: 605 !important;
  }
  // smart browser help in title popover
  .container-help {
    width: 100%;
    height: 200%;
    padding-left: 39px !important;
  }
  // mobile smart browser help in title popover
  .container-help-mobile {
    width: 50%;
    height: 50%;
    padding-left: 15px !important;
  }
</style>
