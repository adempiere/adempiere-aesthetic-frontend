<template>
  <el-col
    v-if="!isEmptyValue(items.children)"
    key="is-desktop-dropdown"
    :span="24"
  >
    <el-collapse v-model="activeNames" class="collapse-wrapper">
      <el-collapse-item :title="title" name="1" class="collapse-item">
        <el-row justify="space-around">
          <template v-for="(childItems, index) in items.children">
            <el-col :key="index" :span="isMobile">
              <menu-card :items="childItems" size="small" />
            </el-col>
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-col>
  <el-col v-else key="is-mobile-dropdown" :span="isMobile" class="column">
    <menu-card :items="items" size="medium" />
  </el-col>
</template>

<style lang="scss">
.collapse-item {
  .el-collapse-item__header {
    height: 60px;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    margin-left: 16px;
  }
}
.collapse-wrapper {
  margin: 20px 0 30px 0;
}
</style>
