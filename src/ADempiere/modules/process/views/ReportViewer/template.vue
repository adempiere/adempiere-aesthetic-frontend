<template>
    <div
        v-if="isLoading"
        key="report-viewer-loaded"
        style="min-height: inherit;"
    >
        <context-menu
            v-if="showContextMenu"
            :container-uuid="reportResult.processUuid"
            :panel-type="panelType"
            :is-report="true"
            :last-parameter="reportResult.processUuid"
            :report-format="reportFormat"
        />
        <el-row type="flex" style="min-height: inherit;">
            <el-col :span="24">
                <div class="content">
                    <h3 class="text-center" style="margin: 0 !important;">
                        <el-popover
                            v-if="(processMetadata.help)"
                            ref="helpTitle"
                            placement="top-start"
                            :title="reportTitle"
                            width="400"
                            trigger="hover"
                        >
                            <div v-html="processMetadata.help" />
                        </el-popover>
                        <el-button
                            v-popover:helpTitle
                            type="text"
                            class="title"
                        >
                            {{ reportTitle }}
                        </el-button>
                    </h3>
                    <iframe
                        v-if="reportFormat === 'pdf'"
                        key="report-content-pdf"
                        class="content-api"
                        :src="url"
                        width="100%"
                        height="100%"
                    />
                    <div
                    v-else-if="['html', 'txt'].includes(reportFormat)"
                    key="report-content-html"
                    class="content-txt"
                    >
                        <el-container class="sub-content-html">
                            <el-main style="padding: 0;">
                                <div
                                    class="el-table--striped el-table--border el-table--scrollable-y el-table--scrollable-x"
                                    v-html="reportContent"
                                />
                            </el-main>
                        </el-container>
                    </div>
                    <div
                    v-else-if="collectionReportFormat.includes(reportFormat)"
                    key="report-content-all"
                    class="content-api"
                    :src="url"
                    />
                </div>
            </el-col>
        </el-row>

        <modal-dialog
            :metadata="processMetadata"
            :parent-uuid="reportResult.processUuid"
            :report-export-type="reportFormat"
            :panel-type="panelType"
        />
    </div>
    <div
        v-else
        key="report-viewer-loading"
        v-loading="!isLoading"
        :element-loading-text="$t('notifications.loading')"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        class="loading-report-viewer"
    />
</template>

<style lang="scss" scoped>
.loading-report-viewer {
    padding: 100px 100px;
    height: 100%;
}

.title {
    color: #000000;
    text-size-adjust: 20px;
    font-size: 100%;
    font-weight: 605 !important;
}
.content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
}
.content-html {
    width: 100%;
    height: 100%;
    padding: 10px;
}
.content-api {
    width: 100%;
    height: 90%;
    padding-right: 10px;
}
.content-txt {
    width: 100%;
    height: inherit;
    padding-left: 10px;
    padding-right: 10px;

    .sub-content-html {
        min-height: inherit;
        height: inherit;
        max-height: -webkit-max-content;
        max-height: -moz-max-content;
        max-height: max-content;
        width: 100%;
        padding-bottom: 4%;
    }
}
.content-excel {
    width: 100%;
    margin-top: 20px;
}
.container {
    width: 200%;
    /* left: 50%; */
}
.container-report {
    width: 100%;
}
</style>
