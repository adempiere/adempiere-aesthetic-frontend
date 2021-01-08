<template>
  <div class="wrapper">
    <el-form
      v-shortkey="{closeForm: ['esc']}"
      label-position="top"
      size="small"
      class="location-address"
      @shortkey.native="keyAction"
    >
      <el-row :gutter="24">
        <template v-if="isLoaded">
          <field
            v-for="(field) in fieldsListLocation"
            :key="field.columnName"
            :metadata-field="field"
          />
        </template>
        <div
          v-else
          key="form-loading"
          v-loading="!isLoaded"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          style="min-height: calc(50vh - 84px)"
          class="loading-panel"
        />

        <el-col :span="24">
          <samp style="float: right; padding-right: 10px;">
            <el-button
              :disabled="!isLoaded"
              type="primary"
              class="custom-button-address-location"
              icon="el-icon-check"
              @click="sendValuesToServer"
            />
            <el-button
              type="danger"
              class="custom-button-address-location"
              icon="el-icon-close"
              @click="setShowedLocationForm(false)"
            />
          </samp>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
  .location-address {
    .el-form-item {
        margin-bottom: 0px !important;
    }

    .custom-button-address-location {
      float: right;
      margin-right: 10px;
    }
  }
</style>

<style lang="scss">
.location-address {
  .el-form-item--small .el-form-item__label {
    line-height: 22px !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }
}
</style>
