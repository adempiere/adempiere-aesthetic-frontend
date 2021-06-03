<template>
  <div>
    <el-card
      v-if="isNote"
      class="box-card chat-entries-list-card"
    >
      <span
        slot="header"
        class="clearfix chat-entries-card-title"
      >
        <i class="el-icon-notebook-2" style="color: #1890ff;" /> {{ $t('window.containerInfo.notes') }}
      </span>
      <el-scrollbar wrap-class="chat-scroll-desktop">
        <el-timeline>
          <el-timeline-item
            v-for="(chats, key) in chatList"
            :key="key"
            icon="el-icon-postcard"
            :timestamp="translateDate(chats.logDate)"
            placement="top"
          >
            <el-card shadow="always" style="border: 2px solid rgba(210, 225, 255, 0.84);">
              <div v-markdown="chats.characterData" style="padding-top: 2%; padding-bottom: 2%" />
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
      <input-chat />
      <el-button
        icon="el-icon-check"
        style="float: right; "
        type="primary"
        @click="sendComment()"
      />
      <el-button
        icon="el-icon-close"
        style="float: right;margin-right: 1%;"
        type="danger"
        @click="clear()"
      />
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
.el-card__body {
    padding: 20px;
    height: 100%;
}
.chat-scroll-desktop {
  max-height: 40vh !important;
}
</style>
