<template>
  <el-container
    class="view-base"
    style="height: max-content !important;"
  >
    <el-header style="height: 39px;">
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="metadata.containerUuid"
        :panel-type="panelType"
      />
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card
            v-if="isLoaded"
            key="form-loaded"
            class="content-collapse"
            :style="!(metadata.fieldsList) ? 'height: max-content !important;' : ''"
          >
            <h3 class="warn-content text-center">
              <el-popover
                v-if="(metadata.help)"
                ref="helpTitle"
                placement="top-start"
                :title="formTitle"
                width="400"
                trigger="hover"
              >
                <div v-html="metadata.help" />
              </el-popover>
              <el-button
                v-popover:helpTitle
                type="text"
                class="custom-title text-center"
              >
                {{ formTitle }}
              </el-button>
            </h3>

            <!-- emulated component form -->
            <div class="wrapper">
              <el-form
                label-position="top"
                label-width="200px"
              >
                <el-row>
                  <field
                    v-for="(fieldMetadata) in fieldsList"
                    :key="fieldMetadata.columnName"
                    :metadata-field="fieldMetadata"
                  />
                </el-row>
              </el-form>
            </div>
            <!-- emulated component form -->

          </el-card>
          <div
            v-else
            key="form-loading"
            v-loading="!isLoaded"
            :element-loading-text="$t('notifications.loading')"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="view-loading"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
  .center{
    text-align: center;
  }
</style>
