<template>
  <el-select
    v-model="selectedFields"
    :filterable="!this.isMobile"
    :placeholder="$t('components.filterableItems')"
    multiple
    collapse-tags
    value-key="key"
    style="float: right;"
    @change="addField"
  >
    <el-option
      v-for="(item, key) in fieldsListOptional"
      :key="key"
      :label="item.name"
      :value="item.columnName"
    />
  </el-select>
</template>

<style>
  .el-tag--small {
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
    max-width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-select .el-tag__close.el-icon-close {
    background-color: #C0C4CC;
    right: 0px;
    top: 0;
    color: #FFFFFF;
  }
</style>
