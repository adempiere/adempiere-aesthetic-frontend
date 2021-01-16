<template>
  <span>
    <el-popover
      ref="contextInfoField"
      placement="top"
      width="300"
      trigger="click"
    >
      <p
        class="pre-formatted"
        v-html="fieldAttributes.contextInfo.messageText.msgText"
      />
      <div>
        <span class="custom-tittle-popover">
          {{ fieldAttributes.name }}
        </span>
        {{ fieldAttributes.help }}
      </div>
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
    </el-popover>
    <span v-popover:contextInfoField>
      {{ fieldAttributes.name }}
    </span>
  </span>
</template>
