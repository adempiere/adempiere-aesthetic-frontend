<template>
  <el-autocomplete
    v-model="displayedValue"
    :placeholder="placeholder"
    :fetch-suggestions="localSearch"
    clearable
    value-key="name"
    style="width: 100%;"
    popper-class="custom-field-bpartner-info"
    @focus="isFocus = true"
    @blur="isFocus = false"
  >
    <template slot="suffix">
      <i
        class="el-icon-arrow-down el-input__icon"
      />
    </template>
  </el-autocomplete>
</template>
