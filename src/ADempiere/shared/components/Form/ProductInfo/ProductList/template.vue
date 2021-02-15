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
        :label="$t('form.productInfo.code')"
      />
      <el-table-column
        label="Producto"
      >
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right" width="450">
            <b><i> {{ scope.row.product.name }} </i> </b>
            <el-divider />
            <p><b style="float: left"> {{ $t('form.productInfo.code') }}</b><spam style="float: right">{{ scope.row.product.value }}</spam></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.upc') }}</b><spam style="float: right"> {{ scope.row.product.upc }} </spam></p>
            <p><b style="float: left"> {{ $t('form.productInfo.price') }} </b><spam style="float: right"> {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }} </spam></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.taxAmount') }}</b><spam style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }} </spam></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotal') }}</b><spam style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }} </spam></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotalConverted') }} {{ scope.row.schemaCurrency.iSOCode }} </b><span style="float: right"> {{ formatPrice(getTaxAmount(scope.row.schemaPriceStandard, scope.row.taxRate.rate) + scope.row.schemaPriceStandard, scope.row.schemaCurrency.iSOCode) }} </span></p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.product.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.taxAmount')"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.grandTotal')"
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
