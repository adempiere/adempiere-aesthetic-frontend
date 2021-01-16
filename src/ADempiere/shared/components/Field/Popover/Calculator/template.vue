<template>
  <el-dropdown trigger="click">
    <el-button type="text" :disabled="fieldAttributes.readonly" @click="focusCalc">
      <i class="el-icon-s-operation el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="dropdown-calc">
      <el-input
        ref="calculatorInput"
        v-model="calcValue"
        class="calc-input"
        @keydown.native="calculateValue"
        @keyup.enter.native="changeValue"
      >
        <template slot="append">{{ valueToDisplay }}</template>
      </el-input>
      <el-table
        ref="calculator"
        :data="tableData"
        style="width: 100%"
        border
        :show-header="false"
        :span-method="spanMethod"
        class="calc-table"
        @cell-click="sendValue"
      >
        <el-table-column
          align="center"
          prop="row1"
          height="50"
          width="50"
        >
          <template slot-scope="{row, column}">
            <el-button type="text" :disabled="isDisabled(row, column)">{{ row.row1.value }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="row2"
          height="50"
          width="50"
        >
          <template slot-scope="{row, column}">
            <el-button type="text" :disabled="isDisabled(row, column)">{{ row.row2.value }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="row3"
          height="50"
          width="50"
        >
          <template slot-scope="{row, column}">
            <el-button type="text" :disabled="isDisabled(row, column)">{{ row.row3.value }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="row4"
          height="50"
          width="50"
        >
          <template slot-scope="{row, column}">
            <el-button type="text" :disabled="isDisabled(row, column)">{{ row.row4.value }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="row5"
          height="50"
          width="50"
        >
          <template slot-scope="{row, column}">
            <el-button type="text" :disabled="isDisabled(row, column)">{{ row.row5.value }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dropdown-menu>
  </el-dropdown>
</template>
