<template>
  <el-container style="background: white; height: 100% !important;">
    <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
      <el-row :gutter="24">
        <template v-for="(value, key) in isAddTypePay">
          <el-col :key="key" :span="12" style="padding-left: 5px; padding-right: 5px;">
            <el-card :body-style="{padding: '0px'}">
              <el-row>
                <el-col :span="6" style="padding: 10px">
                  <img src="@/image/ADempiere/pos/no-image.jpg" fit="contain" class="image">
                </el-col>
                <el-col :span="18">
                  <el-button
                    type="text"
                    icon="el-icon-close"
                    style="float: right; margin-right: 10px; color: red; padding-top: 10px;"
                    @click="deleteCollect(value)"
                  />
                  <div style="padding-right: 10px; padding-top: 10%;">
                    <div class="top clearfix">
                      <span>
                        {{
                          tenderTypeFind({
                            currentPayment: value.tenderTypeCode,
                            listTypePayment: labelTypesPayment
                          })
                        }}
                      </span>
                    </div>
                    <div class="bottom clearfix" style="margin-top: 0px !important!">
                      <el-button
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ value.documentNo }}
                      </el-button>

                      <el-button
                        v-if="!isEmptyValue(value.paymentDate)"
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ formatDate(value.paymentDate) }}
                      </el-button>
                      <div
                        v-if="loginCovertion"
                        slot="header"
                        class="clearfix"
                        style="padding-bottom: 20px;"
                      >
                        <p class="total">
                           <b v-if="!isEmptyValue(value.multiplyRate)" style="float: right;">
                            {{ formatPrice(value.multiplyRate, currency.iSOCode) }}
                          </b>
                          <b v-else style="float: right;">
                            {{ formatPrice(value.amount, currency.iSOCode) }}
                          </b>
                        </p>
                        <br>
                        <p v-if="!isEmptyValue(value.currencyConvertion)" class="total">
                          <b style="float: right;">
                            {{ formatPrice(value.amountConvertion, value.currencyConvertion.iSOCode) }}
                          </b>
                        </p>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
  .el-image {
    display: inline-block;
    overflow: hidden;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  .bottom {
    margin-top: 0px!important;
    line-height: 1px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 9vh;
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

  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
</style>
