<template>
  <el-tabs v-model="currentTab" type="border-card" :before-leave="handleBeforeLeave" @tab-click="handleClick">
    <template v-for="(tabAttributes, key) in tabsList">
      <el-tab-pane
        :key="key"
        :label="tabAttributes.name"
        :windowuuid="windowUuid"
        :tabuuid="tabAttributes.uuid"
        :name="String(key)"
        lazy
        :disabled="Boolean(key > 0 && isCreateNew)"
        :style="tabParentStyle"
      >
        <main-panel
          :parent-uuid="windowUuid"
          :container-uuid="tabAttributes.uuid"
          :metadata="tabAttributes"
          :group-tab="tabAttributes.tabGroup"
          :panel-type="panelType"
          :is-showed-record-navigation="windowMetadata.isShowedRecordNavigation"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>
