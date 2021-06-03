<template>
 <div>
    <el-card class="box-card" style="padding: 1%;">
      <div slot="header" class="clearfix">
        <span>
          {{ $t('field.field') }}
          <b> {{ fieldAttributes.name }} </b>
        </span>
      </div>
      <el-scrollbar wrap-class="scroll-child">
        <el-form ref="form" label-position="top" label-width="120px" style="overflow: auto;" @submit.native.prevent="notSubmitForm">
          <el-form-item v-if="!isEmptyValue(messageText)" :label="$t('field.contextInfo')">
            {{ messageText }}
          </el-form-item>
          <el-form-item :label="$t('field.container.description')">
            {{ fieldAttributes.description }}
          </el-form-item>
          <el-form-item :label="$t('field.container.help')">
            {{ fieldAttributes.help }}
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template v-for="(zoomItem, index) in fieldAttributes.reference.zoomWindows">
        <el-button
          :key="index"
          type="text"
          @click="redirect({window: zoomItem})"
        >
          {{ $t('table.ProcessActivity.zoomIn') }}
          {{ zoomItem.name }}
        </el-button>
      </template>
    </el-card>
  </div>
</template>
