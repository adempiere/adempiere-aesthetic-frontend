<template>
  <div>
    <el-card
      v-if="!isEmptyValue(chatEntryList)"
      style="padding-left: 0px !important"
    >
      <el-scrollbar wrap-class="chat-scroll-mobile">
        <el-timeline>
          <el-timeline-item
            v-for="(chats, key) in chatEntryList"
            :key="key"
            icon="el-icon-postcard"
            :timestamp="translateDate(chats.logDate)"
            placement="top"
          >
            <el-card shadow="always" style="border: 2px solid #d2e1ffd6;">
              <div
                v-markdown="chats.characterData"
                style="padding-top: 2%; padding-bottom: 2%"
              />
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>
    <div v-else>
      <p>
        {{ $t('data.emptyNote') }}
      </p>
    </div>
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
  padding: 0px;
  height: 100%;
}
.chat-scroll-mobile {
  max-height: 60vh !important;
}
.chat-scroll-panel-right {
  max-height: 50vh !important;
  padding-bottom: 10% !important;
}
.el-timeline-item__icon {
  color: #1890ff;
  font-size: 19px;
  background: white;
}
.el-timeline {
  margin: 0;
  font-size: 14px;
  padding-left: 5%;
  list-style: none;
}
.el-timeline-item__timestamp {
  color: #55575b;
  line-height: 1;
  font-size: 13px;
}
</style>
