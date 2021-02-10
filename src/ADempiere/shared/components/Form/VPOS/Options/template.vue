<template>
  <div>
    <div style="text-align: center">
      <b>{{ $t('form.pos.title') }}</b>
      <br>
      {{ $t('form.pos.optionsPoinSales.title') }}
    </div>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="salesOrder">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="!($route.query.action) ? 'cursor: not-allowed; text-align: center !important; color: gray;' : blockOption"
                @click="newOrder"
              >
                <i class="el-icon-news" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <el-popover
                v-model="isShowOrdersList"
                placement="right"
                width="800"
                trigger="click"
              >
                <orders-list
                  v-if="isShowOrdersList"
                  :parent-metadata="metadata"
                />
                <p
                  slot="reference"
                  :style="blockOption"
                >
                  <svg-icon icon-class="list" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
                </p>
              </el-popover>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="generateImmediateInvoice"
              >
                <i class="el-icon-document-add" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="completePreparedOrder"
              >
                <i class="el-icon-success" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="reverseSalesTransaction"
              >
                <i class="el-icon-error" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="createWithdrawal"
              >
                <i class="el-icon-document-remove" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.createPos') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="printOrder"
              >
                <i class="el-icon-printer" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.toPrint') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="createNewCustomerReturnOrder"
              >
                <i class="el-icon-refresh-left" />
                <br>
                Crear Nueva Orden de Devolución
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
              >
                <i class="el-icon-sell" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashOpening') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
              >
                <i class="el-icon-money" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="cashClosing"
              >
                <i class="el-icon-sold-out" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.closeBox') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions">
        <el-row :gutter="12" style="padding-right: 10px;">
          <!--
          <el-col :span="size">
            <el-card shadow="hover">
              <el-popover
                placement="right"
                width="400"
                trigger="click"
              >
                <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                  <field
                    :key="typeDocumentMetadata.columnName"
                    :metadata-field="typeDocumentMetadata"
                    :v-model="typeDocumentMetadata.value"
                    style="padding-left: 0px; padding-right: 0px;"
                  />
                </el-form>
                <p slot="reference" :style="blockOption">
                  <i class="el-icon-document-copy" />
                  <br>
                  Cambiar Tipo de Documento
                </p>
              </el-popover>
            </el-card>
          </el-col>
          -->

          <el-col :span="size">
            <el-card shadow="hover">
              <el-dropdown trigger="click" style="padding-top: 8px; color: black;" @command="changePos">
                <p
                  :style="blockOption"
                >
                  <i class="el-icon-mobile-phone" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.changePos') }}
                </p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in sellingPointsList"
                    :key="item.uuid"
                    :command="item"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card shadow="hover">
              <el-popover
                v-model="isShowProductsPriceList"
                placement="right"
                width="800"
                trigger="manual"
              >
                <list-product-price
                  v-if="isShowProductsPriceList"
                  :is-selectable="false"
                  popover-name="isShowPopoverMenu"
                />

                <div
                  slot="reference"
                  :style="blockOption"
                  @click="isShowProductsPriceList = !isShowProductsPriceList"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.listProducts') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>

        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss" scoped>
  .el-button--text {
    border-color: transparent;
    color: black;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
  }
  .el-button--text:hover, .el-button--text:focus {
    color: #46a6ff !important;
    border-color: transparent;
    background-color: transparent;
  }
  .el-col :hover {
    background-color: rgba(209, 233, 255, 0.719);
  }
  .title-of-option {
    cursor: pointer;
    text-align: center !important;
  }
</style>
