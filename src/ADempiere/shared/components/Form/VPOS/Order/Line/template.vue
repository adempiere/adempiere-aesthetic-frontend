<template>
  <div class="wrapper">
    <el-row
      v-if="!isEmptyValue(metadataList) && isLoadedField"
    >
      <template
        v-for="(field, index) in metadataList"
      >
        <el-col :key="index" :span="8">
          <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
            <Field
              v-if="field.columnName === 'PriceEntered'"
              :key="field.columnName"
              :metadata-field="{
                ...field,
                isReadOnly: !isModifyPrice
              }"
            />
            <Field
              v-if="field.columnName === 'QtyEntered'"
              :key="field.columnName"
              :metadata-field="field"
            />
            <el-popover
              v-if="columnNameVisible === field.columnName"
              ref="ping"
              placement="right"
              v-model="visible"
              trigger="click"
            >
              <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                <el-form-item label="Ingrese Ping">
                  <el-input
                    v-model="input"
                    placeholder="Ingrese Ping"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <span style="float: right;">
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  @click="closePing"
                />
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  @click="checkclosePing"
                />
              </span>
              <el-button
              slot="reference"
              type="text"
              disabled
              @click="visible = !visible" />
            </el-popover>
            <Field
                v-if="field.columnName === 'Discount'"
                :key="field.columnName"
                :metadata-field="{
                  ...field,
                  isReadOnly: !isModifyPrice
                }"
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
