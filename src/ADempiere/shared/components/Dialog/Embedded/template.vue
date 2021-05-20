<template>
  <el-dialog
    :visible="isVisibleDialog"
    show-close
    :before-close="closeDialog"
    :width="width + '%'"
    top="5vh"
    close-on-press-escape
    close-on-click-modal
  >
    <span slot="title">
      {{ attributeEmbedded.name }}
      <el-tooltip :content="lock ? $t('data.lockRecord') : $t('data.unlockRecord')" placement="top">
        <el-button type="text" @click="lock = !lock">
          <i :class="lock ? 'el-icon-unlock' : 'el-icon-lock'" style="font-size: 25px;color: black;" />
        </el-button>
      </el-tooltip>
    </span>
    <slot />
  </el-dialog>
</template>

<style>
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 75vh;
    overflow: auto;
  }
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    background: #dae6f38c;
}
</style>
