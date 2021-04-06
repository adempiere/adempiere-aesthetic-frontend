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
      <FieldDefinition
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
        :label="$t('form.productInfo.product')"
      >
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right" width="450">
            <b><i> {{ scope.row.product.name }} </i> </b>
            <el-divider />
            <p><b style="float: left">{{ $t('form.productInfo.code') }}</b><span style="float: right">{{ scope.row.product.value }}</span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.upc') }}</b><span style="float: right"> {{ scope.row.product.upc }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.quantityOnHand') }}</b><span style="float: right"> {{ formatQuantity(scope.row.quantityOnHand) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.price') }}</b><span style="float: right"> {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.taxAmount') }}</b><span style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotal') }}</b><span style="float: right"><b> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }} </b></span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotalConverted') }} ({{ scope.row.schemaCurrency.iSOCode }}) </b><span style="float: right"><b> {{ formatPrice(getTaxAmount(scope.row.schemaPriceStandard, scope.row.taxRate.rate) + scope.row.schemaPriceStandard, scope.row.schemaCurrency.iSOCode) }} </b></span></p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.product.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatQuantity(scope.row.quantityOnHand) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.quantityAvailable')"
        align="right"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatQuantity(scope.row.quantityAvailable) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.taxAmount')"
        align="right"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }}
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
      <el-table-column
        label=""
        width="100"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ $t('form.pos.tableProduct.options') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown" style="padding-bottom: 0px;">
              <span v-show="!isEmptyValue(process)">
                <el-dropdown-item v-for="(report, key) in process" :key="key" icon="el-icon-document">
                  <span @click="associatedprocesses(scope.row.product.id, report)">
                    {{ report.name }}
                  </span>
                </el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
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
