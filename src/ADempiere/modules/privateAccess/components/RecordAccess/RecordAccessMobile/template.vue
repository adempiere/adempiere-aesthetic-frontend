<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('data.recordAccess.actions') }}
      </span>
    </div>
    <div style="margin-bottom: 10%;">
      <span style="margin-bottom: 10%;">
        {{ $t('data.recordAccess.hideRecord') }}
      </span>
      <br>
      <el-select
        v-model="getterListExclude"
        multiple
        style="margin-top: 5%;"
        placeholder="Select"
        clearable
        @change="addListExclude"
      >
        <el-option
          v-for="item in getterDataRecords"
          :key="item.clientId"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </div>
    <div
      style="margin-bottom: 10%;"
    >
      <span
        style="margin-bottom: 10%;"
      >
        {{ $t('data.recordAccess.recordDisplay') }}
      </span>
      <br>
      <el-select
        v-model="getterListInclude"
        multiple
        style="margin-top: 5%;"
        placeholder="Select"
        @change="addListInclude"
      >
        <el-option
          v-for="item in getterDataRecords"
          :key="item.clientId"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </div>
    <el-form
      label-position="top"
      size="small"
      class="create-bp"
    >
      <el-row :gutter="24">
        <template
          v-for="(record, index) in getterListInclude"
        >
          <div :key="index" style="margin-left: 5%;">
            <el-tag>
              {{ record }}
            </el-tag>
            <p>
              {{ $t('data.recordAccess.isReadonly') }}
              <el-checkbox v-model="isReadonly" />
            </p>
            <p>
              {{ $t('data.recordAccess.isDependentEntities') }} <el-checkbox v-model="isDependentEntities" />
            </p>
          </div>
        </template>
      </el-row>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
  .board-column {
    min-width: 250px;
    min-height: 70px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 30px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 30px;
        padding: 0px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
<style lang="scss">
  .board {
    width: 100%;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.working {
      .board-column-header {
        background: #4A9FF9;
      }
    }
  }
</style>
