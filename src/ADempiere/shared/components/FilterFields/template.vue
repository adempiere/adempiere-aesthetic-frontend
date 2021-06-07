<template>
  <el-form class="form-filter-fields">
    <!-- <el-form-item :label="groupField"> -->
    <el-form-item>
      <el-select
        v-model="selectedFields"
        :filterable="!isMobile"
        :placeholder="$t('components.filterableItems')"
        multiple
        collapse-tags
        value-key="key"
        :popper-append-to-body="false"
        @change="addField"
      >
        <el-option
          v-for="(item, key) in fieldsListOptional"
          :key="key"
          :label="item.name"
          :value="item.columnName"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.form-filter-fields {
  .el-form-item {
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
}
</style>
<style lang="scss">
.form-filter-fields {
  // position
  float: right;
  .el-tag--small {
    max-width: 132px !important;
  }
  // text tag
  .el-tag {
    &.el-tag--info {
      &.el-tag--small {
        &.el-tag--light  {
          // max-width: calc(100% - 10px);
          &:first-child {
            .el-select__tags-text {
              max-width: calc(100% - 15px);
            }
          }
        }
      }
    }
  }
  .el-select__tags-text {
    width: 100%;
    overflow: hidden !important;
    white-space: nowrap;
    text-overflow: ellipsis !important; // ... end text
    display: inline-block;
  }
  // icon X close tag
  .el-select i.el-tag__close {
    &.el-tag__close {
      // left: 58%;
      // margin-top: 0px !important;
      // top: 0 !important;
      color: #FFF !important;
      // position: absolute !important;
      position: relative !important;
      top: -7 !important;
    }
  }
}
</style>
