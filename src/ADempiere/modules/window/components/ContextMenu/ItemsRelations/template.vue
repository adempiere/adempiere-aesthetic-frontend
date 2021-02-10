<template>
    <!-- summary elements view -->
    <el-submenu
        v-if="item.meta.type === 'summary'"
        key="is-summary"
        :index="item.meta.title"
        popper-append-to-body
    >
        <template slot="title">
            <svg-icon v-if="isMobile" icon-class="nested" />
            {{ item.meta.title }}
        </template>
        <el-scrollbar wrap-class="scroll-child">
            <el-menu-item
            v-for="(child, subkey) in getChilds(item)"
            :key="subkey"
            :index="child.meta.uuid"
            >
            {{ child.meta.title }}
            </el-menu-item>
        </el-scrollbar>
    </el-submenu>

    <!-- item menu views -->
    <el-menu-item
        v-else
        v-show="item.meta.uuid !== $route.meta.uuid"
        key="not-summary"
        :index="item.meta.uuid"
        @click="handleClick(item)"
    >
        <svg-icon v-if="isMobile" :icon-class="classIconMenuRight" />
        {{ item.meta.title }}
    </el-menu-item>
</template>

<style>
.scroll {
    max-height: 400px;
}
</style>
