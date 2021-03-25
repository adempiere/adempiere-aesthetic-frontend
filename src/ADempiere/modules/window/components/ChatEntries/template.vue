<template>
  <div>
    <el-card
      v-if="isNote"
      class="box-card chat-entries-list-card"
      :style="{'height': getHeightPanelBottom + 'vh'}"
    >
      <span
        slot="header"
        class="clearfix chat-entries-card-title"
      >
        {{ $t('window.containerInfo.notes') }}
      </span>
      <el-scrollbar wrap-class="scroll-window-log-chat">
        <el-timeline>
          <el-timeline-item
            v-for="(chats, key) in chatList"
            :key="key"
            :timestamp="translateDate(chats.logDate)"
            placement="top"
          >
            <el-card shadow="hover">
              <div v-markdown="chats.characterData" />
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>

    <el-card
      class="box-card chat-entry-create-card"
    >
      <span slot="header" class="clearfix chat-entries-card-title">
        {{ $t('window.containerInfo.logWorkflow.addNote') }}
      </span>
      <el-scrollbar>
        <input-chat />

        <el-button
          icon="el-icon-check"
          style="float: right;"
          type="primary"
          circle
          @click="sendComment()"
        />
        <el-button
          icon="el-icon-close"
          style="float: right;margin-right: 1%;"
          type="danger"
          @click="clear()"
        />
      </el-scrollbar>
    </el-card>
  </div>
</template>

<style lang="scss">
.chat-entries-list-card {
  // small title of the card
  .el-card__header {
    max-height: 35px !important;
    padding: 10px 20px !important;
  }

  // brings the card space closer to the timerline
  .el-card__body {
    padding-left: 0px !important;
  }

  .el-timeline-item__content {
    .el-card {
      // remove the right spacing so that it does not overlap with the scroll
      margin-right: 20px !important;
      // removes excessive card content space from chat logs
      .el-card__body {
        padding-left: 20px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
      }
    }
  }
}

.chat-entry-create-card {
  // small title of the card
  .el-card__header {
    max-height: 35px !important;
    padding: 10px 20px !important;
  }
}
</style>
