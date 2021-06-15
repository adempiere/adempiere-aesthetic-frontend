<template>
  <el-select
    v-model="value"
    multiple
    filterable
    allow-create
    :placeholder="metadata.placeholder"
    :class="'custom-field-select custom-field-select-multiple ' + metadata.cssClassName"
    @change="preHandleChange"
  >
    <el-option
      v-for="(option, key) in value"
      :key="key"
      :value="option"
    />
  </el-select>
</template>
