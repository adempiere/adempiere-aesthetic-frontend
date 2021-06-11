<template>
  <div
    v-if="isLoaded"
    id="headerContainer"
    style="display: -webkit-box; height: 100%"
  >
    <el-container style="background: white; height: 100%!important;">
      <el-header
        height="auto"
        :style="isShowedPOSKeyLayout ? 'padding-right: 20px; padding-left: 0px;' : 'padding-right: 0px; padding-left: 0px;'"
      >
        <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="colFieldProductCode" style="padding-left: 0px; padding-right: 0px;">
              <template
                v-for="(field) in fieldsList"
              >
                <product-info
                  v-if="field.columnName === 'ProductValue'"
                  :key="field.columnName"
                  :metadata="field"
                />
              </template>
            </el-col>
            <el-col :span="colFieldBusinessPartner" style="padding-left: 0px; padding-right: 0px;">
              <business-partner
                :parent-metadata="{
                  name: panelMetadata.name,
                  containerUuid: panelMetadata.containerUuid,
                  uuid: panelMetadata.uuid,
                  panelType: panelMetadata.panelType
                }"
                :is-disabled="isDisabled"
              />
            </el-col>
            <el-col v-if="!isMobile" :span="isEmptyValue(currentOrder) ? 1 : 4" :style="isShowedPOSKeyLayout ? 'padding: 0px;' : 'padding: 0px;margin-top: 2.9%;'">
              <el-form-item>
                <el-row :gutter="24">
                  <el-col :span="10" style="padding-left: 0px; padding-right: 0px;">
                    <el-tag
                      v-if="!isEmptyValue(currentOrder.documentStatus.value)"
                      :type="tagStatus(currentOrder.documentStatus.value)"
                    >
                      <span v-if="!isEmptyValue(currentOrder.documentStatus.value)">
                        {{ currentOrder.documentStatus.name }}
                      </span>
                    </el-tag>
                  </el-col>
                  <el-col :span="14" style="padding-left: 0px; padding-right: 0px;">
                    <el-button type="primary" plain :disabled="isEmptyValue(this.$route.query.action)" @click="newOrder">
                      {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
        <el-container style="background: white; padding: 0px; height: 100% !important;">
          <el-main style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
            <el-table
              ref="linesTable"
              v-shortkey="shortsKey"
              :data="listOrderLine"
              border
              highlight-current-row
              fit
              style="overflow: auto;"
              @current-change="handleCurrentLineChange"
              @shortkey.native="shortcutKeyMethod"
            >
              <el-table-column
                v-for="(valueOrder, item, key) in orderLineDefinition"
                :key="key"
                :column-key="valueOrder.columnName"
                :label="valueOrder.label"
                :width="!valueOrder.isNumeric ? valueOrder.size : valueOrder.size"
                :align="valueOrder.isNumeric ? 'right' : 'left'"
              >
                <template slot-scope="scope">
                  <span>
                    {{ displayValue(scope.row, valueOrder) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('form.pos.tableProduct.options')"
                width="180"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="!isEmptyValue(listOrderLine)"
                    placement="right"
                    trigger="click"
                    :title="$t('form.productInfo.productInformation')"
                  >
                    <el-form
                      label-position="top"
                      style="float: right; display: flex; line-height: 30px;"
                    >
                      <el-row :gutter="24">
                        <el-col :span="4">
                          <div>
                            <el-avatar shape="square" :size="100" src="https://#" @error="true">
                              <el-image>
                                <div slot="error" class="image-slot">
                                  <i class="el-icon-picture-outline" />
                                </div>
                              </el-image>
                            </el-avatar>
                          </div>
                        </el-col>
                        <el-col :span="10">
                          {{ $t('form.productInfo.code') }}: <b>{{ scope.row.product.value }}</b><br>
                          {{ $t('form.productInfo.name') }}: <b>{{ scope.row.product.name }}</b><br>
                          {{ $t('form.productInfo.description') }}: <b>{{ scope.row.product.description }}</b><br>
                        </el-col>
                        <el-col :span="10">
                          <div style="float: right">
                            {{ $t('form.productInfo.price') }}:
                            <b>{{ formatPrice(scope.row.product.priceStandard, pointOfSalesCurrency.iSOCode) }}</b>
                            <br>
                            {{ $t('form.productInfo.taxAmount') }}:
                            <b>{{ scope.row.taxIndicator }}</b>
                            <br>
                            {{ $t('form.productInfo.quantityAvailable') }}:
                            <b>{{ formatQuantity(scope.row.quantityOrdered) }}</b>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                    <el-button slot="reference" type="primary" icon="el-icon-info" size="mini" style="margin-right: 3%;" />
                  </el-popover>
                  <el-popover
                    placement="right"
                    trigger="click"
                    :title="$t('form.pos.tableProduct.editQuantities')"
                    width="600"
                    @hide="showFieldLine = false"
                  >
                    <field-line
                      :data-line="scope.row"
                      :show-field="showFieldLine"
                      :current-line="currentLineOrder"
                    />
                    <el-button slot="reference" type="success" icon="el-icon-edit" size="mini" style="margin-right: 3%;" @click="showEditLine(scope.row)" />
                  </el-popover>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOrderLine(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-main>

          <el-footer :class="classOrderFooter">
            <div class="keypad">
              <el-button type="primary" icon="el-icon-top" :disabled="isDisabled" @click="arrowTop" />
              <el-button type="primary" icon="el-icon-bottom" :disabled="isDisabled" @click="arrowBottom" />
              <el-button v-show="isValidForDeleteLine(listOrderLine)" type="danger" icon="el-icon-delete" :disabled="isDisabled" @click="deleteOrderLine(currentOrderLine)" />
              <el-button
                v-show="isValidForDeleteLine(listOrderLine)"
                type="success"
                icon="el-icon-bank-card"
                @click="openCollectionPanel"
              >
                {{ labelButtonCollections }}
              </el-button>
              <br>
              <p>
                <el-dropdown
                  v-if="!isEmptyValue(currentPointOfSales)"
                  trigger="click"
                  style="padding-top: 8px; color: black;"
                  @command="changePos"
                >
                  <p>
                    <i class="el-icon-mobile-phone" />
                    {{ $t('form.pos.order.pointSale') }}: <b style="cursor: pointer"> {{ currentPointOfSales.name }} </b>
                  </p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listPointOfSales"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div>
            <span v-if="isMobile" style="float: right;padding-right: 3%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}
                <b class="order-info">
                  {{ getItemQuantity }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}
                <b class="order-info">
                  {{ numberOfLines }}
                </b></p>
            </span>
            <span style="float: right;">
              <p class="total">{{ $t('form.pos.order.seller') }}:<b style="float: right;">
                {{ currentOrder.salesRepresentative.name }}
              </b></p>
              <p class="total"> {{ $t('form.pos.order.subTotal') }}:<b class="order-info">{{ formatPrice(currentOrder.totalLines, pointOfSalesCurrency.iSOCode) }}</b></p>
              <p class="total"> {{ $t('form.pos.order.discount') }}:<b class="order-info">{{ formatPrice(0, pointOfSalesCurrency.iSOCode) }}</b> </p>
              <p class="total"> {{ $t('form.pos.order.tax') }}:<b style="float: right;">{{ getOrderTax(pointOfSalesCurrency.iSOCode) }}</b> </p>
              <p class="total">
                <b>
                  {{ $t('form.pos.order.total') }}:
                </b>
                <b style="float: right;">
                  <el-popover
                    :v-model="seeConversion"
                    placement="top-start"
                    trigger="click"
                    @hide="closeConvertion"
                  >
                    <convert-amount
                      v-show="seeConversion"
                      :convert="multiplyRate"
                      :amount="currentOrder.grandTotal"
                      :currency="pointOfSalesCurrency"
                      :is-open="seeConversion"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;" @click="seeConversion = !seeConversion">
                      {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
            </span>
            <span v-if="!isMobile" style="float: right;padding-right: 3%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}
                <b class="order-info">
                  {{ getItemQuantity }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}
                <b class="order-info">
                  {{ numberOfLines }}
                </b></p>
            </span>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
    <div v-if="isMobile && isShowedPOSKeyLayout" :style="classButtomRight">
      <el-button
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
    <div v-if="!isMobile" :style="classButtomRight">
      <el-button
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
  </div>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<style scoped>
  .delete-buttom {
    border: none;
    width: 100%;
    text-align: left;
  }
  .el-col-24 {
    width: 100%;
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .el-col-6 {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .footer-mobile {
    padding: 0px;
    height: auto !important;
    overflow: auto;
    display: contents;
  }
  .footer-table {
    padding-top: 0px;
    padding-right: 9px;
    padding-bottom: 0px;
    padding-left: 9px;
    height: auto !important;
  }
  .keypad {
    float: left;
    height: 20%;
    padding-top: 25px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  /* Style of Table */
  .el-table {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #606266;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding: 0px;
  }
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
    text-align: center;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .order-header {
    padding-left: 10px;
    font-size: 13px;
  }
  .order-info {
    float: right;
    padding-left: 9px;
  }
  .transition-box {
    z-index: 1;
    width: auto;
    position: fixed;
    bottom: 5%;
    right: 5%;
  }
</style>
