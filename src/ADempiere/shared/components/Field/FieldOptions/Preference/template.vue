<template>
<el-card
    v-if="!isEmptyValue(metadataList)"
    class="box-card"
    style="padding: 1%;"
  >
    <div slot="header" class="clearfix">
      <span>
        {{ $t('components.preference.title') }}
        <b>
          {{ fieldAttributes.name }}
          {{ fieldValue }}
        </b>
      </span>
    </div>
    <div class="text item">
      {{
        getDescriptionOfPreference
      }}
    </div>
    <br>
    <div class="text item">
      <el-form
        :inline="true"
      >
        <el-form-item>
          <p slot="label">
            {{ fieldAttributes.name }}: {{ fieldValue }}
          </p>
        </el-form-item>
      </el-form>
      <el-form
        label-position="top"
        :inline="true"
        class="demo-form-inline"
        size="medium"
      >
        <el-form-item
          v-for="(field) in metadataList"
          :key="field.sequence"
        >
          <p slot="label">
            {{ field.name }}
          </p>
          <el-switch
            v-model="field.value"
          />
        </el-form-item>
      </el-form>
    </div>
    <br>
    <el-row>
      <el-col :span="24">
        <samp style="float: left; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-address-location"
            icon="el-icon-delete"
            @click="remove()"
          />
        </samp>
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-address-location"
            icon="el-icon-close"
            @click="close()"
          />
          <el-button
            type="primary"
            class="custom-button-address-location"
            icon="el-icon-check"
            @click="sendValue()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
  <div
    v-else
    v-loading="isEmptyValue(metadataList)"
    :element-loading-text="$t('notifications.loading')"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="loading-window"
  />
</template>

<style>
 .title {
    color: #000000;
    text-size-adjust: 20px;
    font-size: 120%;
    /* font-weight: 605!important;
    left: 50%; */
  }
  .value {
    color: #606266;
    text-size-adjust: 20px;
    font-size: 120%;
    /* font-weight: 605!important;
    left: 50%; */
  }
</style>
