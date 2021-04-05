<template>
 <el-calendar>
  <!-- Use 2.5 slot syntax. If you use Vue 2.6, please use new slot syntax-->
  <template slot="dateCell" slot-scope="{data}">
   <p :class="data.isSelected ? 'is-selected' : ''">
    {{
     data.day
      .split('-')
      .slice(2)
      .join('-')
    }}
    {{ data.isSelected ? '✔️' : '' }}
   </p>
  </template>
 </el-calendar>
</template>

<style>
.is-selected {
 color: #1989fa;
}
</style>
