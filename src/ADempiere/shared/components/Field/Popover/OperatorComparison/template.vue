<template>
  <span v-if="fieldAttributes.isComparisonField">
    <el-popover
      ref="operatorComarison"
      placement="top"
      width="230"
      trigger="click"
    >
      <span class="custom-tittle-popover">
        {{ $t('operators.operator') }}:
      </span>
      <el-select
        v-model="value"
        @change="changeOperator"
      >
        <el-option
          v-for="(item, key) in fieldAttributes.operatorsList"
          :key="key"
          :value="item"
          :label="$t('operators.' + item)"
        />
      </el-select>
    </el-popover>
    <span v-popover:operatorComarison>
      {{ fieldAttributes.name }}
    </span>
  </span>
</template>
