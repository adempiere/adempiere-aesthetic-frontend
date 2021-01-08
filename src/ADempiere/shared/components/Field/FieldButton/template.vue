<template>
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    type="hidden"
    @change="preHandleChange"
  />
</template>
