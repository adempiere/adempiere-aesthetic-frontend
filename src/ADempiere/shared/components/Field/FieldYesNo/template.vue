<template>
  <el-switch
    :ref="metadata.columnName"
    v-model="value"
    :active-text="value ? $t('components.switchActiveText') : $t('components.switchInactiveText')"
    :class="cssClassStyle"
    :true-value="true"
    :false-value="false"
    :disabled="isDisabled"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
  />
</template>

<style scoped>
  .custom-field-yes-no {
    max-height: 34px;
  }
</style>
