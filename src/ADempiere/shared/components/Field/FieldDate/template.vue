<template>
  <el-date-picker
    :ref="metadata.columnName"
    v-model="value"
    :format="formatView"
    :value-format="formatSend"
    :type="typePicker"
    range-separator="-"
    :placeholder="metadata.help"
    :start-placeholder="$t('components.dateStartPlaceholder')"
    :end-placeholder="$t('components.dateEndPlaceholder')"
    unlink-panels
    :class="cssClassStyle"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :picker-options="pickerOptions"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
  />
</template>

<style scoped>
  .custom-field-date {
    width: 100% !important;
  }
</style>
