<template>
  <div :style="labelStyle">
    <span>
      {{ label }}
    </span>
    <span v-if="isMandatory" :style="'color: #f34b4b'">*</span>
    <i class="el-icon-info" :style="iconStyle" />
  </div>
</template>

<style scoped>
.el-icon-info {
    font-size: 11px;
    color: #008fd3;
}
</style>
