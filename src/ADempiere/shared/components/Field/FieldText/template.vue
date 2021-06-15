<template>
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    :pattern="pattern"
    :rows="rows"
    :class="cssClassStyle"
    :type="typeTextBox"
    :placeholder="metadata.placeholder"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :maxlength="maxLength"
    :show-password="Boolean(metadata.isEncrypted)"
    :autofocus="metadata.inTable"
    :size="inputSize"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
    @keyup.native.enter="actionKeyPerformed"
    @submit="false"
  />
</template>

<style>
  .custom-field-text {
    max-height: 34px;
  }
  .el-textarea__inner {
    resize: none !important;
  }
</style>
