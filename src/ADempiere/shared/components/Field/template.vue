<template>
  <!--
    this v-show is to indicate that if the field is not shown,
    therefore you should not leave the column size spacing of your
    <el-col></el-col> container-->
  <div v-if="!inTable">
    <el-col
      v-if="isDisplayed"
      key="is-panel-template"
      :xs="sizeFieldResponsive.xs"
      :sm="sizeFieldResponsive.sm"
      :md="sizeFieldResponsive.md"
      :lg="sizeFieldResponsive.lg"
      :xl="sizeFieldResponsive.xl"
      :class="classField"
    >
      <el-form-item>
        <template slot="label">
          <field-options
            :metadata="fieldAttributes"
          />
        </template>

        <component
          :is="componentRender"
          :ref="field.columnName"
          :metadata="fieldAttributes"
          :value-model="recordDataFields"
        />
      </el-form-item>
    </el-col>
  </div>
  <component
    :is="componentRender"
    v-else
    key="is-table-template"
    :class="classField"
    :metadata="fieldAttributes"
    :value-model="recordDataFields"
    :in-table="true"
  />
</template>

<style lang="scss">
  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
  }

  /**
   * Maximum height to avoid distorting the field list
   */
  .el-form-item__content {
    max-height: 36px !important;
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }

  .in-table {
    margin-bottom: 0px !important;
    margin-left: 0px;
    margin-right: 0px;
  }

  /**
   * Min height all text area, not into table
   */
  .el-textarea__inner:not(.in-table) {
    min-height: 36px !important;
    /*
    height: 36px auto !important;
    max-height: 54.2333px !important;
    */
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
  .pre-formatted {
    white-space: pre;
  }
</style>
