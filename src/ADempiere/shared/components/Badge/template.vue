<template>
  <el-badge :value="getRecordNotification.length" :hidden="getRecordNotification.length === 0" type="primary" class="item" style="vertical-align: baseline;">
    <el-popover
      placement="bottom"
      width="400"
      trigger="click"
    >
      <el-table
        :data="getRecordNotification"
        :highlight-current-row="true"
        @cell-click="handleCurrentChange"
      >
        <el-table-column prop="name" :label="$t('navbar.badge.Notifications')" />
        <el-table-column
          fixed="right"
          width="50"
        >
          <template slot="header">
            <el-button
              icon="el-icon-delete"
              type="text"
              @click.native.prevent="deleteAll()"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              icon="el-icon-close"
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, getRecordNotification)"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="50"
          class-name="procesActivity"
        >
          <el-tooltip effect="dark" :content="$t('navbar.badge.link')" placement="top-start">
            <svg-icon icon-class="tree-table" />
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-button slot="reference" type="text" icon="el-icon-bell" style="float: left;color: #000000;font-size: 121%;font-weight: 615!important;padding-top: 14px;" />
    </el-popover>
  </el-badge>
</template>
