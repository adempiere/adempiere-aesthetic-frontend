<template>
  <div class="operator-comparison">
    <span class="custom-tittle-popover">
      {{ $t('operators.compareSearch') }}:
    </span>
    <br />

    <el-select v-model="currentOperator" @change="changeOperator">
      <el-option
        v-for="(itemOperator, key) in operatorsList"
        :key="key"
        :value="itemOperator"
        :label="$t('operators.' + itemOperator)"
      />
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.custom-tittle-popover {
  font-size: 14px;
  font-weight: bold;
  float: left;
}
.operator-comparison {
  margin: 10px;
  padding: 10px;
}
</style>
