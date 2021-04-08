<template>
  <div>
    <el-form-item>
      <template slot="label">
        {{ $t('form.productInfo.codeProduct') }}
         <el-popover
          placement="right"
          trigger="click"
          width="800"
        >
          <ProductInfoList />
          <el-button
            slot="reference"
            type="text"
            icon="el-icon-search"
            style="color: black"
          />
        </el-popover>
      </template>

      <el-autocomplete
        v-model="value"
        v-shortkey="keyShortcuts"
        :placeholder="$t('quickAccess.searchWithEnter')"
        clearable
        style="width: 100%;"
        popper-class="custom-field-prodcut-info"
        :fetch-suggestions="localSearch"
        :select-when-unmatched="true"
        @shortkey.native="shortcutKeyMethod"
        @select="handleSelect"
      >
        <template slot="prefix">
          <svg-icon
            icon-class="shopping"
            class="el-input__icon"
          />
          <!--
          <i
            class="el-icon-shopping-cart-full el-input__icon"
          />
          -->
        </template>

        <template slot-scope="props">
          <div class="header">
            <b> {{ props.item.product.value }} - {{ props.item.product.name }} </b>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="upc">
                <!-- <b>UPC / EAN Barras:</b> <br> -->
                {{ props.item.product.upc }} <br>
                <span class="description">
                  {{ props.item.product.description }}
                </span>
              </span>
            </el-col>
            <!-- <el-col :span="6">
              <span class="upc">
                {{ props.item.product.description }}
              </span>
            </el-col> -->
            <!-- <el-col :span="6">
              <span class="upc">
                {{ props.item.quantityAvailable }}
              </span>
            </el-col> -->
            <el-col :span="12">
              <span class="price">
                {{ formatPrice(props.item.priceStandard, props.item.currency.iSOCode) }}
                <br>
                <span class="quantityAvailable">
                  {{ formatQuantity(props.item.quantityAvailable) }}
                </span>
                <!-- {{ props.item.currency.curSymbol }} -->
              </span>
            </el-col>
          </el-row>
        </template>
      </el-autocomplete>
    </el-form-item>
  </div>
</template>

<style lang="scss" scope>
  .transition-box {
    z-index: 3;
    position: absolute;
    width: 800px;
    left: 15%;
  }
  .custom-field-prodcut-info {
    li {
      line-height: normal;
      padding: 15px;

      .header {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .upc {
        color: #7e7e7e;
        padding-top: 10px;
        float: left;
      }
      .description {
        padding-top: 10px;
        float: left;
      }
      .price {
        color: #7e7e7e;
        padding-top: 10px;
        float: right;
        padding-right: 10px;
      }
      .quantityAvailable {
        float: right;
        padding-top: 10px;
      }
    }
  }
</style>
