<template>
  <el-popover
    v-if="(field.columnName === 'DocStatus') && (!isEmptyValue(processOrderUuid))"
    placement="right"
    width="400"
    trigger="click"
    :disabled="withoutRecord"
  >
    <el-select
      v-model="valueActionDocument"
      @change="documentActionChange"
      @visible-change="listActionDocument"
    >
      <el-option
        v-for="(item, key) in listDocumentActions"
        :key="key"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
    <el-tag
      v-if="isEmptyValue(valueActionDocument)"
      :type="tagStatus(field.value)"
    >
      {{ field.displayColumn }}
    </el-tag>
    <el-tag
      v-else
      :type="tagStatus(valueActionDocument)"
    >
      {{ labelDocumentActions }}
    </el-tag>
    <p v-if="isEmptyValue(valueActionDocument)"> {{ field.description }} </p>
    <p v-else> {{ descriptionDocumentActions }} </p>
    <el-button
      slot="reference"
      type="text"
      icon="el-icon-set-up"
    />
  </el-popover>
</template>
