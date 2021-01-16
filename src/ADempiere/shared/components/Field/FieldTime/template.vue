<template>
  <el-time-picker
    :ref="metadata.columnName"
    v-model="value"
    :picker-options="{
      minTime: minValue,
      maxTime: maxValue
    }"
    :is-range="isPickerRange"
    range-separator="-"
    :placeholder="$t('components.timePlaceholder')"
    :class="cssClassStyle"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
  />
</template>

<style scoped>
  .custom-field-time {
    width: 100% !important;
  }
</style>
