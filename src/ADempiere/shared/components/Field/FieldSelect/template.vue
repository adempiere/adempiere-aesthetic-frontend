<template>
  <el-select
    :ref="metadata.columnName"
    v-model="value"
    :filterable="!isMobile"
    :placeholder="metadata.help"
    :loading="isLoading"
    value-key="id"
    :class="cssClassStyle"
    clearable
    :multiple="isSelectMultiple"
    :allow-create="metadata.isSelectCreated"
    :collapse-tags="!isSelectMultiple"
    :disabled="isDisabled"
    @change="preHandleChange"
    @visible-change="getDataLookupList"
    @clear="clearLookup"
  >
    <el-option
      v-for="(option, key) in optionsList"
      :key="key"
      :value="option.id"
      :label="option.label"
    />
  </el-select>
</template>

<style lang="scss" scoped>
  .custom-field-select {
    width: 100%;
  }

  .custom-field-select-multiple {
    overflow: auto;
    max-height: 100px;
    .el-select__tags {
      max-height: 100px;
    }
  }
</style>
