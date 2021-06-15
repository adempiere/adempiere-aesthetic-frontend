<template>
  <el-container style="height: 100% !important;">
    <el-main style="padding-right: 0px;padding-bottom: 0px;display: contents;">
      <Split :gutter-size="isShowedPOSOptions ? 10 : 0" @onDrag="onDragOption">
        <SplitArea :size="isShowedPOSOptions ? 90 : 1">
          <el-container style="height: 100% !important;">
            <el-aside :width="isShowedPOSOptions ? '100%' : '0%'" style="background: white; padding: 0px !important; margin-bottom: 0px">
              <options
                :metadata="metadata"
              />
            </el-aside>
            <div style="width: 36px;padding-top: 30vh; z-index: 100;">
              <el-button
                v-if="isShowedPOSKeyLayout"
                :circle="true"
                type="primary"
                :icon="isShowedPOSOptions ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
                :style="isShowedPOSOptions ? 'position: absolute;': 'position: absolute;left: 0.8%;'"
                @click="isShowedPOSOptions = !isShowedPOSOptions"
              />
              <el-button
                v-else
                :circle="true"
                type="primary"
                :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
                :style="isShowedPOSKeyLayout ? 'position: absolute;': 'position: absolute;left: 0.8%;'"
                @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
              />
            </div>
          </el-container>
        </SplitArea>

        <SplitArea :size="isShowedPOSOptions ? 80 : 99" :min-size="990">
          <Split :gutter-size="isShowedPOSKeyLaout ? 10 : 0" @onDrag="onDragKeyLayout">
            <SplitArea :size="isShowedPOSKeyLaout ? 99 : 1" style="overflow: hidden">
              <order
                :metadata="metadata"
              />
            </SplitArea>
            <SplitArea
              :size="isShowedPOSKeyLaout ? 1: 99"
              :min-size="300"
              style="overflow: auto"
            >
              <key-layout
                v-if="!showCollection"
                key="layout-component"
              />
              <collection
                v-else
                key="collection-component"
              />
            </SplitArea>
          </Split>
        </SplitArea>
      </Split>
    </el-main>
  </el-container>
</template>

<style scoped>
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }
  /* Style of Table */
  .el-table {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #606266;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .image {
    width: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .order-header {
    padding-left: 10px;
    font-size: 13px;
  }
</style>
