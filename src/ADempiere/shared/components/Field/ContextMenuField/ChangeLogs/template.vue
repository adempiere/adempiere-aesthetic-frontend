<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('field.logsField') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>
    <div>
      <el-scrollbar v-if="!isEmptyValue(listLogsField)" :wrap-class="classIsMobilePanel">
        <el-timeline>
          <el-timeline-item
            v-for="(listLogs) in listLogsField.sort(sortSequence)"
            :key="listLogs.logId"
            :type="listLogs.type"
            :timestamp="translateDate(listLogs.logDate)"
            placement="top"
          >
            <el-card shadow="hover" class="clearfix">
              <div>
                {{ listLogs.userName }}
              </div>
              <!-- <el-collapse-transition> -->
              <div>
                <span v-for="(list, index) in listLogs.changeLogsList" :key="index">
                  <p v-if="list.columnName === 'DocStatus'">
                    <b> {{ list.displayColumnName }} :</b>
                    <strike>
                      <el-tag :type="tagStatus(list.oldValue)">
                        {{ list.oldDisplayValue }}
                      </el-tag>
                    </strike>
                    <el-tag :type="tagStatus(list.newValue)">
                      {{ list.newDisplayValue }}
                    </el-tag>
                  </p>
                  <p v-else>
                    <b> {{ list.displayColumnName }} :</b>
                    <strike>
                      <el-link type="danger">
                        {{ list.oldDisplayValue }}
                      </el-link>
                    </strike>
                    <el-link type="success">
                      {{ list.newDisplayValue }}
                    </el-link>
                  </p>
                </span>
              </div>
              <!-- </el-collapse-transition> -->
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style lang="scss">
  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
  }
  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
  .panel-mobile {
    height: 80vh;
  }
</style>
