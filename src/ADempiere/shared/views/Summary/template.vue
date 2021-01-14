<template>
  <div v-if="isIndex" key="sumary" class="app-container">
    <el-popover
      v-if="!isEmptyValue($route.meta.description)"
      ref="routeDescription"
      placement="top"
      width="400"
      trigger="hover"
      :content="$route.meta.description"
    />
    <h3 v-popover:routeDescription class="description">{{ $route.meta.title }}</h3>
    <el-row :gutter="10">
      <template v-if="optionList.children">
        <template v-for="(item, key) in optionList.children">
          <dropdown v-if="$route.name !== item.name" :key="key" :items="item" :title="item.meta.title" />
        </template>
      </template>
      <template v-else>
        <template v-for="(item, key) in optionList">
          <dropdown v-if="$route.name !== item.name" :key="key" :items="item" :title="item.meta.title" />
        </template>
      </template>
    </el-row>
  </div>
  <div v-else key="view">
    <router-view />
  </div>
</template>

<style>
  .description {
    text-align: center;
    cursor: default;
  }
</style>
