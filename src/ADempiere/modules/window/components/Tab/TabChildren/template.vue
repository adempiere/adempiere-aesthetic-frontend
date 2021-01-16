<template>
  <el-tabs v-model="currentTabChild" type="border-card" @tab-click="handleClick">
    <template v-for="(tabAttributes, key) in tabsList">
      <el-tab-pane
        :key="key"
        :label="tabAttributes.name"
        :windowuuid="windowUuid"
        :tabuuid="tabAttributes.uuid"
        :name="String(key)"
        lazy
        :disabled="isCreateNew"
      >
        <el-col :span="24">
          <data-table
            v-if="isLoadedFieldsTabParent"
            key="data-tables-lodaded"
            :parent-uuid="windowUuid"
            :container-uuid="tabAttributes.uuid"
            :panel-type="panelType"
          />
          <div
            v-else
            key="data-tables-loading"
            v-loading="!isLoadedFieldsTabParent"
            :element-loading-text="$t('notifications.loading')"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="loading-panel"
          />
        </el-col>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<style>
  .el-tabs__content {
    overflow: hidden;
    position: relative;
    padding-top: 0px !important;
    padding-right: 15px !important;
    padding-bottom: 0px !important;
    padding-left: 15px !important;
  }
</style>
