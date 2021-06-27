<template>
  <el-container style="background: white; height: 100% !important;">
    <el-main
      style="background: white; padding: 0px; height: 100% !important; overflow: hidden"
    >
      <el-container
        style="background: white; padding: 0px; height: 100% !important;"
      >
        <el-header
          style="height: auto; padding-bottom: 10px; padding-right: 0px; padding-left: 0px"
        >
          <el-card
            class="box-card"
            style="padding-left: 0px; padding-right: 0px"
          >
            <div slot="header" class="clearfix">
              <p class="total">
                <b>{{ $t('form.pos.collect.orderTotal') }}:</b>
                <b style="float: right;">
                  <el-popover placement="top-start" trigger="click">
                    <convert-amount
                      :convert="multiplyRate"
                      :amount="currentOrder.grandTotal"
                      :currency="pointOfSalesCurrency"
                    />
                    <el-button
                      slot="reference"
                      type="text"
                      style="color: #000000;font-weight: 604!important;font-size: 100%;"
                    >
                      {{
                        formatPrice(
                          currentOrder.grandTotal,
                          pointOfSalesCurrency.iSOCode
                        )
                      }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
              <p class="total">
                <b> {{ $t('form.pos.collect.pending') }}: </b>
                <b style="float: right;">
                  <el-popover placement="top-start" trigger="click">
                    <convert-amount
                      :convert="multiplyRate"
                      :amount="pending"
                      :currency="pointOfSalesCurrency"
                    />
                    <el-button
                      slot="reference"
                      type="text"
                      style="color: #000000;font-weight: 604!important;font-size: 100%;"
                    >
                      {{ formatPrice(pending, pointOfSalesCurrency.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
              <p class="total">
                <b>{{ $t('form.pos.collect.dayRate') }}:</b>
                <!-- Conversion rate to date -->
                <b v-if="!isEmptyValue(dateRate)" style="float: right;">
                  <span v-if="!isEmptyValue(dateRate.divideRate)">
                    <span
                      v-if="formatConversionCurrenty(dateRate.divideRate) > 1"
                    >
                      {{
                        formatPrice(
                          formatConversionCurrenty(dateRate.divideRate),
                          dateRate.currencyTo.iSOCode
                        )
                      }}
                    </span>
                    <span v-else>
                      {{ dateRate.currencyTo.iSOCode }}
                      {{ formatConversionCurrenty(dateRate.divideRate) }}
                    </span>
                  </span>
                  <span v-else>
                    {{
                      formatPrice(1, dateRate.iSOCode)
                    }}
                  </span>
                </b>
              </p>
            </div>
            <div v-if="isLoaded" class="text item">
              <el-form
                label-position="top"
                label-width="10px"
                style="float: right; display: flex; line-height: 10px;"
                :disabled="isDisabled"
              >
                <el-row id="fieldListCollection">
                  <el-col
                    v-for="(field, index) in fieldsList"
                    :key="index"
                    :span="8"
                  >
                    <!-- Add selected currency symbol -->
                    <field-definition
                      v-if="field.columnName === 'PayAmt' || field.columnName === 'TenderType'"
                      :key="field.columnName"
                      :metadata-field="
                        field.columnName === 'PayAmt'
                          ? {
                              ...field,
                              labelCurrency: isEmptyValue(dateRate.divideRate) ? dateRate : dateRate.currencyTo
                      } : field"
                    />
                     </el-col>
                  <el-col :span="8">
                    <el-form-item :label="fieldsList[1].name">
                      <el-select
                        v-model="currentFieldCurrency"
                        :placeholder="fieldsList[1].help"
                        @change="changeCurrency"
                      >
                        <el-option
                          v-for="item in listCurrency"
                          :key="item.id"
                          :label="item.name"
                          :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-for="(field, index) in fieldsList" :key="index" :span="8">
                    <!-- Add selected currency symbol -->
                    <field-definition
                      v-if="field.columnName !== 'PayAmt' && field.columnName !== 'TenderType' && field.columnName !== 'C_Currency_ID'"
                      :key="field.columnName"
                      :metadata-field="field.columnName === 'PayAmt' ? {
                        ...field,
                        labelCurrency: isEmptyValue(dateRate.divideRate) ? dateRate : dateRate.currencyTo
                      } : field"
                    />
                     </el-col>
                  <el-col :span="8">
                    <el-form-item :label="fieldsList[1].name">
                      <el-select
                        v-model="currentFieldCurrency"
                        :placeholder="fieldsList[1].help"
                        @change="changeCurrency"
                      >
                        <el-option
                          v-for="item in listCurrency"
                          :key="item.id"
                          :label="item.name"
                          :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-for="(field, index) in fieldsList" :key="index" :span="8">
                    <!-- Add selected currency symbol -->
                    <field-definition
                      v-if="field.columnName !== 'PayAmt' && field.columnName !== 'TenderType' && field.columnName !== 'C_Currency_ID'"
                      :key="field.columnName"
                      :metadata-field="field.columnName === 'PayAmt' ? {
                        ...field,
                        labelCurrency: isEmptyValue(dateRate.divideRate) ? dateRate : dateRate.currencyTo
                      } : field"
                    />
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
          <samp id="buttonCollection" style="float: right;padding-right: 10px;">
            <el-button type="danger" icon="el-icon-close" @click="exit" />
            <el-button
              type="info"
              icon="el-icon-minus"
              :disabled="isDisabled"
              @click="undoPatment"
            />
            <el-button
              type="primary"
              :disabled="validPay || addPay || isDisabled"
              icon="el-icon-plus"
              @click="addCollectToList(paymentBox)"
            />
            <el-button
              type="success"
              :disabled="validateCompleteCollection || isDisabled"
              icon="el-icon-shopping-cart-full"
              @click="completePreparedOrder(listPayments)"
            />
          </samp>
        </el-header>
        <!-- Panel where they show the payments registered from the collection container -->
        <el-main
          style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;"
        >
          <type-collection
            v-if="!updateOrderPaymentPos"
            id="cardCollection"
            :is-add-type-pay="listPayments"
            :currency="pointOfSalesCurrency"
            :list-types-payment="fieldsList[2]"
            :is-loaded="isLoadedPayments"
            :list-payment-type="fieldsPaymentType"
          />
          <div
            v-else
            key="form-loading"
            v-loading="updateOrderPaymentPos"
            :element-loading-text="$t('notifications.loading')"
            :element-loading-spinner="'el-icon-loading'"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="view-loading"
          />
        </el-main>
        <!-- Collection container bottom panel -->
        <el-footer
          id="infoInvoce"
          height="auto"
          style="padding-left: 0px; padding-right: 0px;"
        >
          <el-row :gutter="24" style="background-color: rgb(245, 247, 250);">
            <el-col :span="24">
              <span>
                <p class="total">
                  <b> {{ $t('form.pos.collect.orderTotal') }}: </b>
                  <b style="float: right;">
                    <el-popover placement="top-start" trigger="click">
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="currentOrder.grandTotal"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button
                        slot="reference"
                        type="text"
                        style="color: #000000;font-weight: 604!important;font-size: 100%;"
                      >
                        {{
                          formatPrice(
                            currentOrder.grandTotal,
                            pointOfSalesCurrency.iSOCode
                          )
                        }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>

                <p class="total">
                  {{ $t('form.pos.collect.pending') }}:
                  <b style="float: right;">
                    <el-popover placement="top-start" trigger="click">
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="pending"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button
                        slot="reference"
                        type="text"
                        style="color: #000000;font-weight: 604!important;font-size: 100%;"
                      >
                        {{ formatPrice(pending, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>

                <p class="total">
                  {{ $t('form.pos.collect.payment') }}:
                  <b style="float: right;">
                    <el-popover placement="top-start" trigger="click">
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="pay"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button
                        slot="reference"
                        type="text"
                        style="color: #000000;font-weight: 604!important;font-size: 100%;"
                      >
                        {{ formatPrice(pay, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>
                <p class="total">
                  {{ $t('form.pos.collect.change') }}:
                  <b style="float: right;">
                    <el-popover placement="top-start" trigger="click">
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="change"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button
                        slot="reference"
                        type="text"
                        style="color: #000000;font-weight: 604!important;font-size: 100%;"
                      >
                        {{ formatPrice(change, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>
              </span>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>

<style scoped>
.stylefullPayment {
  font-size: 15px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
.el-button--text {
  border-color: transparent;
  color: #1890ff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0px;
  padding-top: 0px;
}
.el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #e6ebf5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: rgb(245, 247, 250);
}
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
.el-card__body {
  padding-top: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 20px;
  padding-left: 10px !important;
  height: 100% !important;
}
.el-card__header {
  padding: 0px 20px;
  border-bottom: 1px solid #e6ebf5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}
.el-header {
  background: 'white';
  color: #333;
  line-height: 10px;
}

.el-aside {
  color: #333;
}
.el-row {
  margin: 0px !important;
}
.el-tag--medium {
  height: 34px;
  line-height: 32px;
}
.el-col {
  border-radius: 4px;
}
</style>
