<template>
  <el-container
    v-if="isLoaded"
    key="form-loaded"
    :class="showNavar ? 'view-base' : 'show-header-view-base'"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 39px; background: white;"
    >
     <modal-dialog
        :parent-uuid="$route.meta.parentUuid"
        :container-uuid="formUuid"
        :panel-type="panelType"
      />
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="formUuid"
        :panel-type="panelType"
      />
    </el-header>
    <el-main style="padding-right: 0px !important; padding-bottom: 0px !important; padding-top: 0px !important; padding-left: 0px !important;">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card
            class="content-collapse"
            :style="!(formMetadata.fieldsList) ? 'height: 100% !important;' : ''"
          >
              <title-and-help
              v-if="isShowTitleForm"
              :name="formName"
              :help="formMetadata.help">
              <el-button
                type="text"
                style="float: right"
                :circle="true"
                icon="el-icon-arrow-up"
                @click="changeDisplatedTitle" />
            </title-and-help>
            <el-button
              v-if="!isShowTitleForm"
              type="text"
              style="position: absolute; right: 10px;"
              :circle="true"
              icon="el-icon-arrow-down"
              @click="changeDisplatedTitle"
            />
            <form-panel
              :metadata="{
                ...formMetadata,
                fileName: formFileName,
                title: formName
              }"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px !important;
    padding-bottom: 2px !important;
    padding-left: 0px !important;
    height: 100%!important;
  }
</style>
<style scoped >
  .el-row {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%!important;
  }
  .el-col-24 {
    width: 100%;
    height: 100%!important;
  }
  .view-base {
    /** Add this rule to view base */
    overflow: hidden;
  }

  .show-header-view-base {
    height: 100%;
    min-height: calc(100vh - 26px);
    overflow: hidden;
  }

  .w-33 {
    width: 100%;
    background-color: transparent;
  }

  .el-card {
    width: 100% !important;
    height: 100% !important;
  }

  .center{
    text-align: center;
  }
</style>
