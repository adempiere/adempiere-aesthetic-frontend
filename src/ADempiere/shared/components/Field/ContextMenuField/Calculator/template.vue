<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('field.field') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>
    <el-form ref="form" label-position="top" label-width="120px" @submit.native.prevent="notSubmitForm">
      <el-form-item label="Valor">
        <el-input
          ref="calculatorInput"
          v-model="calcValue"
          class="calculator-input"
          size="mini"
          readonly
          @keydown.native="calculateValue"
          @keyup.enter.native="changeValue"
        />
      </el-form-item>
    </el-form>
    <el-table
      ref="calculator"
      :data="tableData"
      style="width: 100%"
      border
      size="mini"
      :show-header="false"
      :span-method="spanMethod"
      class="calculator-table"
      @cell-click="sendValue"
    >
      <el-table-column
        align="center"
        prop="row1"
        height="15"
        width="45"
      >
        <template slot-scope="{row, column}">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row1.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row2"
        height="15"
        width="45"
      >
        <template slot-scope="{row, column}">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row2.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row3"
        height="15"
        width="45"
      >
        <template slot-scope="{row, column}">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row3.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row4"
        height="15"
        width="45"
      >
        <template slot-scope="{row, column}">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row4.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row5"
        height="15"
        width="45"
      >
        <template slot-scope="{row, column}">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row5.value }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style>
.calculator-input > .el-input__inner,
.calculator-input .el-input__inner {
  border-radius: 0px !important;
}
.calculator-input {
  width: 202px;
  font-size: 16px;
  padding-left: 4px;
}
/* row color with hover */
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ffffff !important;
}
.calculator-table .el-table__body-wrapper > table {
  border-spacing: 5px;
}
.calculator-table .el-table__body tr > td {
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  cursor: pointer;
}
.calculator-table th,
.calculator-table td,
.calculator-table > th,
.calculator-table > td {
  padding: 0px !important;
  height: 0px !important;
  padding-left: 0px !important;
}
.calculator-table .el-table .cell {
  padding-right: 5px !important;
  padding-left: 5px !important;
}
.calculator-table .el-table > .cell,
.calculator-table .el-table .cell {
  padding-left: 0px !important;
}
.calculator-table .el-table th.is-leaf,
.el-table td {
  border-bottom: 0px solid #dfe6ec !important;
}
</style>
