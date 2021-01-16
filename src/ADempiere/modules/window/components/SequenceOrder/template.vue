<template>
  <div class="board">
    <div
      :key="1"
      class="kanban todo"
      header-text="Todo"
    >
      <div class="board-column">
        <div class="board-column-header">
          {{ this.$t('sequence.available') }} ({{ getterListAvaliable.length }})
        </div>
        <draggable
          v-model="getterListAvaliable"
          :group="group"
          v-bind="$attrs"
          class="board-column-content"
        >
          <div
            v-for="element in getterListAvaliable"
            :key="element.UUID"
            class="board-item"
          >
            {{ displayedName(element) }}
          </div>
        </draggable>
      </div>
    </div>
    <div
      :key="2"
      class="kanban working"
      header-text="Working"
    >
      <div class="board-column">
        <div class="board-column-header">
          {{ this.$t('sequence.sequence') }}  ({{ getterListSequence.length }})
        </div>
        <draggable
          v-model="getterListSequence"
          :group="group"
          v-bind="$attrs"
          class="board-column-content"
          @change="handleChange"
        >
          <div
            v-for="element in getterListSequence"
            :key="element.UUID"
            class="board-item"
          >
            {{ displayedName(element) }}
          </div>
        </draggable>
      </div>
    </div>
  </div>
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
