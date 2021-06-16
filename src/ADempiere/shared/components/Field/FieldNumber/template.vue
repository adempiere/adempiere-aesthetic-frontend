<template>
  <el-tooltip
    v-model="isShowed"
    manual
    :content="valueToDisplay"
    placement="top"
    effect="light"
  >
    <el-input-number
      v-if="isFocus"
      key="number-input-focus"
      :ref="metadata.columnName"
      v-model="value"
      type="number"
      :min="minValue"
      :max="maxValue"
      :placeholder="metadata.placeholder"
      :disabled="isDisabled"
      :precision="precision"
      :controls="isShowControls"
      :controls-position="controlsPosition"
      :class="cssClassStyle"
      autofocus
      @change="preHandleChange"
      @blur="customFocusLost"
      @focus="focusGained"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
    />
    <el-input
      v-else
      key="number-displayed-blur"
      :ref="metadata.columnName"
      v-model="displayedValue"
      :placeholder="metadata.placeholder"
      :disabled="isDisabled"
      :class="cssClassStyle"
      readonly
      style="text-align-last: end !important"
      @focus="customFocusGained"
    />
  </el-tooltip>
</template>

<style lang="scss" scoped>
  /* Show input width 100% in container */
  .el-input-number, .el-input {
    width: 100% !important; /* ADempiere Custom */
  }
</style>
