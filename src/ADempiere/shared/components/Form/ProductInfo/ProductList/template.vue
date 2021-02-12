<template>
  <el-main
    v-shortkey="shortsKey"
  >
    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      label-width="10px"
      @shortkey.native="keyAction"
      @submit.native.prevent="notSubmitForm"
    >
      <field-definition
        v-for="(field) in fieldsList"
        :key="field.columnName"
        :metadata-field="field"
      />
    </el-form>

    <el-table
      ref="singleTable"
      v-loading="!productPrice.isLoaded"
      :data="listWithPrice"
      border
      fit
      height="550"
      highlight-current-row
      @row-click="findlistProductWithRow"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="product.value"
        label="Codigo"
      />
      <el-table-column
        label="Producto"
      >
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right" width="300">
            <b><i> {{ scope.row.product.name }} </i> </b>
            <el-divider />
            <p><b style="float: left"> Codigo :</b><spam style="float: right">{{ scope.row.product.value }}</spam></p><br>
            <p><b style="float: left">Precio :</b><spam style="float: right"> {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }} </spam></p><br>
            <p><b style="float: left">Tax :</b><spam style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }} </spam></p><br>
            <p><b style="float: left">Gran Total :</b><spam style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }} </spam></p><br>
            <p><b style="float: left">UPC :</b><spam style="float: right"> {{ scope.row.product.upc }} </spam></p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.product.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="Tax"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        label="Precio"
        align="right"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        label="Gran Total"
        align="right"
        width="300"
      >
        <template slot-scope="scope">
          {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="productPrice.recordCount"
      :current-page="productPrice.pageNumber"
      :handle-change-page="handleChangePage"
    />
  </el-main>
</template>
