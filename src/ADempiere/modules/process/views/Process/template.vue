<template>
  <el-container
    v-if="isLoadedMetadata"
    key="process-loaded"
    class="view-base"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 39px;"
    >
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="processUuid"
        :panel-type="panelType"
        :is-report="processMetadata.isReport"
      />
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="content-collapse">
            <title-and-help
              :name="processMetadata.name"
              :help="processMetadata.help"
            />
            <main-panel
              :position-tab="processMetadata.accesLevel"
              :container-uuid="processUuid"
              :metadata="processMetadata"
              :is-edit="isEdit"
              :panel-type="panelType"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <div
    v-else
    key="process-loading"
    v-loading="!isLoadedMetadata"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
</style>
