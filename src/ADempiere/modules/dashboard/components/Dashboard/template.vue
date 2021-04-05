<template>
    <el-collapse
        v-if="!unsupportedDashboards.includes(dashboard.fileName)"
        v-model="activeDashboard"
        accordion
    >
        <el-collapse-item
            :name="dashboard.dashboardName"
            :disabled="!dashboard.isCollapsible"
            class="custom-collapse-item"
        >
            <template slot="title">
                <span class="custom-title">
                    {{ dashboard.dashboardName }}
                </span>
            </template>
            <component
                :is="renderDashboard"
                :ref="dashboard.dashboardName"
                :metadata="dashboard"
            />
        </el-collapse-item>
    </el-collapse>
</template>

<style lang="scss" scoped>
.custom-title {
    padding: 10px;
}
.dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
        position: absolute;
        top: 0px;
        border: 0;
        right: 0;
    }

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}
.custom-collapse-item.is-disabled {
    .custom-title {
        color: #303133;
    }
}
</style>
