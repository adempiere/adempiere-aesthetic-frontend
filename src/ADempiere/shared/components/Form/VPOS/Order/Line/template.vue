<template>
  <div class="wrapper">
    <el-row
      v-if="!isEmptyValue(metadataList)"
    >
      <template
        v-for="(field, index) in metadataList"
      >
        <el-col :key="index" :span="8">
          <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
            <field
              :key="field.columnName"
              :metadata-field="field"
            />
          </el-form>
        </el-col>
      </template>
    </el-row>
    <div
      v-else
      key="form-loading"
      v-loading="isEmptyValue(metadataList)"
      :element-loading-text="$t('notifications.loading')"
      :element-loading-spinner="'el-icon-loading'"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="view-loading"
    />
  </div>
</template>
