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
              :ref="field.columnName"
              :metadata-field="{
                ...field,
                labelCurrency: currencyPointOfSales,
                isReadOnly: !isModifyPrice
              }"
            />
            <Field
              v-if="field.columnName === 'QtyEntered'"
              :key="field.columnName"
              :metadata-field="field"
            />
            <el-popover
              v-if="columnNameVisible === field.columnName && visible"
              ref="ping"
              placement="right"
              v-model="visible"
              trigger="click"
            >
              <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                <el-form-item :label="$t('form.pos.tableProduct.pin')">
                  <el-input
                    v-model="pin"
                    :placeholder="$t('form.pos.tableProduct.pin')"
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
                  @click="checkclosePin(pin, field.columnName)"
                />
              </span>
              <el-button
              slot="reference"
              type="text"
              disabled />
            </el-popover>
            <Field
                v-if="field.columnName === 'Discount'"
                :ref="field.columnName"
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
