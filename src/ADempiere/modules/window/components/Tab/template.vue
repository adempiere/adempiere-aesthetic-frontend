<template>
  <el-tabs :v-model="currentTab" type="border-card" :before-leave="handleBeforeLeave" @tab-click="handleClick">
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
       <span v-if="key === 0" slot="label">
          <el-tooltip v-if="key === 0" :content="lock ? $t('data.lockRecord') : $t('data.unlockRecord')" placement="top">
            <el-button type="text" @click="lockRecord()">
              <i :class="lock ? 'el-icon-unlock' : 'el-icon-lock'" style="font-size: 15px;color: black;" />
            </el-button>
          </el-tooltip>
          {{ tabAttributes.name }}
        </span>
        <span v-else slot="label">
          {{ tabAttributes.name }}
        </span>
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
