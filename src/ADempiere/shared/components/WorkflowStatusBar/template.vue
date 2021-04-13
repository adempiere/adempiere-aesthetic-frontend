<template>
  <el-steps :active="getActive" finish-status="success" simple :style="styleSteps">
    <el-step
      v-for="(node, index) in listDocumentStatus"
      :key="index"
      :icon="index < getActive ? 'el-icon-finished' : (index === getActive ? 'el-icon-s-flag' : 'el-icon-d-arrow-right')"
    >
      <template slot="title">
        <el-popover
          v-if="index === getActive"
          index="popver-active"
          placement="top-start"
          width="400"
          trigger="click"
        >
          <el-select
            v-model="value"
            @change="documentActionChange"
            @visible-change="listActionDocument"
          >
            <el-option
              v-for="(item, key) in listDocumentActions"
              :key="key"
              :label="item.name"
              :value="item.value"
              :disabled="item.isDisabled"
            />
          </el-select>

          <el-tag
            v-if="!isEmptyValue(value)"
            index="tag-with-value"
            :type="tagStatus(value)"
          >
            {{ displayedValue }}
          </el-tag>
          <el-tag
            v-else
            index="tag-without-value"
            :type="tagStatus(value)"
          >
            {{ infoDocumentAction.name }}
          </el-tag>

          <p v-if="!isEmptyValue(infoDocumentAction.description)" index="with-description">
            {{ infoDocumentAction.description }}
          </p>
          <p v-else index="without-description">
            {{ fieldDocStatus.description }}
          </p>

          <el-link slot="reference" :autofocus="true" :underline="false" class="title">
            {{ node.name }}
          </el-link>
        </el-popover>
        <span v-else index="node-name">
          {{ node.name }}
        </span>
      </template>
    </el-step>
  </el-steps>
</template>

<style scoped>
  .el-button--text {
    border-color: transparent;
    color: #000000;
  }
</style>
<style>
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .el-step.is-simple {
    display: -webkit-box;
    display: -ms-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 50%;
  }
  .el-step.is-simple .el-step__arrow {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    /* flex-grow: 1; */
    display: flex;
    display: -ms-flexbox;
    margin-top: -9px !important;
    /* margin-bottom: -7px; */
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .el-step.is-simple .el-step__main {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: inline-block;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    /* -webkit-box-flex: 1; */
    -ms-flex-positive: 1;
    -webkit-box-flex: 1;
    flex-grow: 1;
    width: 15vw;
  }
  .title {
    color: #000000;
    text-size-adjust: 14px;
    font-size: 100%;
    font-weight: 605!important;
  }
  .el-step.is-simple .el-step__title {
    font-size: 14px;
    line-height: 20px;
  }
  .el-step.is-simple:last-of-type .el-step__arrow {
    display: flex;
  }
  .el-step.is-simple .el-step__head {
    width: auto;
    font-size: 0;
    padding-right: 10px;
    margin-bottom: -5px !important;
  }
</style>
