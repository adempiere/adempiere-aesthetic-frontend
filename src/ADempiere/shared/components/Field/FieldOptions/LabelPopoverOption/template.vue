<template>
  <div :style="textStyle">
    <i v-if="!option.svg" :class="option.icon" style="font-weight: bolder;" />
    <svg-icon v-else :icon-class="option.icon" :name="option.icon" :style="iconWrapperStyle" />
    <span>
      <b class="label">
        {{ option.name }}
      </b>
    </span>
  </div>
</template>

<style>
.svg-icon-wrapper {
  margin-left: 5px;
  margin-right: 13px;
}
</style>
