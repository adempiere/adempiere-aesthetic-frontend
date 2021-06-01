<template>
  <div v-if="isIndex" key="sumary" class="app-container">
    <title-and-help
      :name="$route.meta.title"
      :help="$route.meta.description"
    />
    <el-row :gutter="10">
      <template v-if="optionList">
        <template v-for="(item, key) in optionList">
          <dropdown-menu v-if="$route.name !== item.name" :key="key" :items="item" :title="item.meta.title" />
        </template>
      </template>
      <template v-else>
        <template v-for="(item, key) in optionList">
          <dropdown-menu v-if="$route.name !== item.name" :key="key" :items="item" :title="item.meta.title" />
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
