<template>
  <el-container
    v-if="isLoaded"
    key="browser-loaded"
    class="view-base"
    style="height: 86vh;"
  >
    <modal-dialog
      :parent-uuid="browserMetadata.uuid"
      :container-uuid="browserUuid"
      :panel-type="panelType"
    />
    <el-header
      v-if="showContextMenu"
    >
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="browserUuid"
        :panel-type="panelType"
      />
      <div class="w-33">
        <div class="center">
          <TitleAndHelp
            :name="browserMetadata.name"
            :help="browserMetadata.help"
          />
        </div>
      </div>
    </el-header>
    <el-main>

      <el-collapse
        v-model="activeSearch"
        class="container-collasep-open"
        @change="handleChange"
      >
        <el-collapse-item :title="$t('views.searchCriteria')" name="opened-criteria">
          <main-panel
            :container-uuid="browserUuid"
            :metadata="browserMetadata"
            :panel-type="panelType"
          />
        </el-collapse-item>
      </el-collapse>
      <data-table
        v-if="isLoaded"
        :container-uuid="browserUuid"
        :panel-type="panelType"
        :metadata="browserMetadata"
      />
    </el-main>
  </el-container>
  <div
    v-else
    key="browser-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<style>
  .el-collapse-item__header:hover {
    background-color: #fcfcfc;
  }
</style>
<style scoped>

  .el-main {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 0px;
    padding-right: 20px;
    padding-top: 0px;
    padding-left: 20px;
  }
  .el-header {
    height: 50px;
  }
  .containert {
    padding-left: 20px;
    padding-right: 20px;
    width: 50%;
  }
  .menu {
    height: 40px;
  }

  .center{
    text-align: center;
  }
  .w-33 {
    width: 100%;
    background-color: transparent;
  }
  .container-panel {
    bottom: 0;
    right: 0;
    z-index: 0;
    transition: width 0.28s;
    border: 1px solid #e5e9f2;
  }
  .container-panel-open {
    bottom: 0;
    right: 0;
    border: 1px solid #e5e9f2;
    height: -webkit-fill-available;
    height:-webkit-calc(100% - 100px);
    z-index: 0;
    transition: width 0.28s;
  }
  .container-collasep-open {
    bottom: 0;
    right: 0;
    z-index: 0;
    transition: width 0.28s;
  }
</style>
