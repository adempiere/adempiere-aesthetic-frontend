<template>
  <el-container style="background: white; height: 100% !important;">
    <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
      <el-container style="background: white; padding: 0px; height: 100% !important;">
        <el-header style="height: auto; padding-bottom: 10px; padding-right: 0px; padding-left: 0px">
          <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
            <div slot="header" class="clearfix">
              <p class="total">
                <b>{{ $t('form.pos.collect.orderTotal') }}:</b>
                <b style="float: right;">
                  <el-popover
                    placement="top-start"
                    trigger="click"
                  >
                    <convert-amount
                      :convert="multiplyRate"
                      :amount="order.grandTotal"
                      :currency="currencyPoint"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(order.grandTotal, currencyPoint.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
              <p class="total">
                <b> {{ $t('form.pos.collect.pending') }}: </b>
                <b style="float: right;">
                  <el-popover
                    placement="top-start"
                    trigger="click"
                  >
                    <convert-amount
                      :convert="multiplyRate"
                      :amount="pending"
                      :currency="currencyPoint"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(pending, currencyPoint.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
            </div>
            <div
              v-if="isLoaded"
              class="text item"
            >
              <el-form
                label-position="top"
                label-width="10px"
                style="float: right; display: flex; line-height: 10px;"
              >
                <el-row>
                  <el-col v-for="(field, index) in fieldsList" :key="index" :span="8">
                    <field-definition
                      :key="field.columnName"
                      :metadata-field="field"
                    />
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
          <samp style="float: right;padding-right: 10px;">
            <el-checkbox v-show="fullCopper" v-model="checked">
              <el-link
                type="danger"
                class="stylefullPayment">
                <b>
                  {{ $t('form.pos.collect.fullPayment') }}
                </b>
              </el-link>
            </el-checkbox>
            <el-button type="danger" icon="el-icon-close" @click="cancel" />

            <el-button type="primary" :disabled="validPay || addPay" icon="el-icon-plus" @click="addCollectToList(paymentBox)" />
            <el-button type="success" :disabled="validateCompleteCollection" icon="el-icon-shopping-cart-full" />
          </samp>
        </el-header>
        <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
          <type-collection
            v-if="isLoaded"
            :is-add-type-pay="paymentBox"
            :currency="currencyPoint"
          />
          <div
            v-else
            key="form-loading"
            v-loading="!isLoaded"
            :element-loading-text="$t('notifications.loading')"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="loading-panel"
          />
        </el-main>

        <el-footer height="auto" style="padding-left: 0px; padding-right: 0px;">
          <el-row :gutter="24" style="background-color: rgb(245, 247, 250);">
            <el-col :span="24">
              <span>
                <p class="total">
                  <b>
                    {{ $t('form.pos.collect.orderTotal') }}:
                  </b>
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="order.grandTotal"
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(order.grandTotal, currencyPoint.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>

                <p class="total">
                  {{ $t('form.pos.collect.pending') }}:
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="pending"
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(pending, currencyPoint.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>

                <p class="total">
                  {{ $t('form.pos.collect.payment') }}:
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="pay"
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(pay, currencyPoint.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>
                <p class="total">
                  {{ $t('form.pos.collect.change') }}:
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="change"
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(change, currencyPoint.iSOCode) }}
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
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
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
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
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
    margin: 0px!important;
  }
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
  }
  .el-col {
    border-radius: 4px;
  }
</style>
