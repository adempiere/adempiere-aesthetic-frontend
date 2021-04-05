<template>
  <component
    :is="templateDevice"
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :metadata="metadata"
    :group-tab="groupTab"
    :panel-type="panelType"
    :is-advanced-query="isAdvancedQuery"
    :is-showed-record-navigation="isShowedRecordNavigation"
  />
</template>

<style>
  .select-filter {
    width: 280px !important;
    float: right;
    top: 0;
  }
  .select-filter-header {
    width: 60% !important;
    float: right;
    top: 0px;
  }
</style>
