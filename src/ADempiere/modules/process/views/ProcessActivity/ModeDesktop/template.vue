<template>
  <div v-if="!isEmptyValue(getProcessLog)" key="with-process" class="app-container">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in getProcessLog"
        :key="index"
        :timestamp="translateDate(activity.lastRun)"
        placement="top"
        type="primary"
        size="large"
        :color="checkStatus(activity).color"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span><b>{{ activity.name }}</b></span>
            <div class="actions">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ $t('components.contextMenuActions') }}<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="activity.isReport" :command="{...activity, command: 'seeReport'}">
                    {{ $t('views.seeReport') }}
                  </el-dropdown-item>
                  <el-dropdown-item :command="{...activity, command: 'zoomIn'}">
                    {{ $t('table.ProcessActivity.zoomIn') }}
                  </el-dropdown-item>
                  <!-- TODO: add more actions -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-form label-position="top">
            <el-form-item v-if="activity.description" :label="generateTitle('Description')">
              <span><b>{{ activity.description }}</b></span>
              <span v-if="activity.isReport">{{ activity.output.description }}</span>
            </el-form-item>
            <el-form-item :label="generateTitle('Status')">
              <!-- show only when it is error -->
              <el-popover
                v-if="activity.isError && !activity.summary && !activity.isReport"
                :key="index + 'is-error'"
                placement="right"
                width="700"
                trigger="hover"
              >
                <div>
                  {{ activity.message }}
                </div>
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
              <!-- show only when bring logs -->
              <el-popover
                v-else-if="!isEmptyValue(activity.logsList) || !isEmptyValue(activity.summary)"
                :key="index + 'is-summary'"
                placement="right"
                width="500"
                trigger="hover"
              >
                <b>{{ $t('table.ProcessActivity.Logs') }}</b><br>
                <ul>
                  <li @click="handleCommand({...activity, command: 'zoomIn'})"> {{ activity.summary }} </li>
                  <el-scrollbar wrap-class="popover-scroll">
                    <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                      {{ logItem.log }}
                    </li>
                  </el-scrollbar>
                </ul>
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
              <!-- show only when bring output -->
              <el-popover
                v-else-if="activity.isReport"
                :key="index + 'is-output'"
                placement="right"
                width="700"
                trigger="hover"
              >
                <div>
                  <span> {{ $t('table.ProcessActivity.Output') }} </span><br>
                  <span>{{ $t('table.ProcessActivity.Name') }}: {{ activity.output.name }}</span><br>
                  <span>{{ $t('table.ProcessActivity.Description') }}: {{ activity.output.description }}</span><br>
                  <span>{{ $t('table.ProcessActivity.FileName') }}: {{ activity.output.fileName }}</span><br>
                  <a type="text" :href="activity.url" :download="activity.download">
                    {{ $t('components.contextMenuDownload') }} <i class="el-icon-download" />
                  </a>
                </div>
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
              <el-popover
                v-else
                :key="index + 'is-other'"
                placement="top-start"
                :title="$t('table.ProcessActivity.Logs')"
                width="200"
                trigger="hover"
                :content="activity.summary"
              >
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
            </el-form-item>
          </el-form>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
  <div v-else key="without-process">
    <h1 class="text-center">{{ $t('views.noProcess') }}</h1>
  </div>
</template>

<style lang="scss" scoped src="../styles/processActivityStyle.scss"></style>
<style>
  .popover-scroll {
    max-height: 200px !important;
  }
</style>
