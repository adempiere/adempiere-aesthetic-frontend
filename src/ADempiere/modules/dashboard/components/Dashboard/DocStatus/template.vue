<template>
    <el-card class="box-card" :body-style="{padding: '0px'}" shadow="never">
        <div class="recent-items">
            <el-table
                :data="dataResult"
                max-height="455"
                @row-click="handleClick"
            >
                <el-table-column prop="recordCount" width="60" />
                <el-table-column>
                    <template slot="header" slot-scope="scope">
                        <el-input
                            v-model="search"
                            size="mini"
                            :metadata="scope"
                            :placeholder="$t('table.dataTable.search')"
                        >
                            <svg-icon slot="prefix" icon-class="search" />
                        </el-input>
                    </template>
                    <template slot-scope="{row}">
                        <span>{{ row.name }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<style scoped>
.el-table {
    background-color: #FFFFFF;
    cursor: pointer;
}
.search_recent {
    width: 50% !important;
    float: right;
}
.header {
    padding-bottom: 10px;
}
.recent-items {
    height: 455px;
    overflow: auto;
}
.time {
    float: left;
    font-size: 11px;
    color: #999;
}
.card-box {
    cursor: pointer;
}
.card-content {
    font-size: 15px;
}
.icon-window {
    font-size: x-large;
    color: #36a3f7;
}
.action-tag {
    float: right;
}
</style>
