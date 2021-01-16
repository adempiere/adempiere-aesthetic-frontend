<template>
  <el-container style="background: white; height: 100% !important;">
    <el-header>
      <div class="clearfix" style="padding: 0px; margin: 0px">
        <el-row>
          <el-col :span="20" style="padding-left: 20%; padding-right: 0px">
            <p style="text-align: center; padding: 0px; margin: 0px;">
              <b>{{ getLayoutHeader.name }}</b>
              <br>
              {{ getLayoutHeader.description }}
            </p>
          </el-col>
        </el-row>
      </div>
      <el-button
        icon="el-icon-s-home"
        size="small"
        style="float: right"
        circle
        @click="handleCommand"
      />
    </el-header>

    <el-main>
      <el-card
        v-if="!isEmptyValue(getKeyList)"
      >
        <el-row style="padding: 2px">
          <template v-for="(keyValue, key) in getKeyList">
            <el-col :key="key" :span="size">
              <el-card
                :body-style="{padding: '0px'}"
                :data="getImage(keyValue.resourceReference)"
                shadow="always"
              >
                <span>
                  <p style="padding-left: 10px; font-size: 12px; color: #0e2ea4">
                    <b>{{ keyValue.name }}</b>
                  </p>
                  <!--
                  <b style="padding-left: 10px; font-size: 10px; color: #359e43">
                    Available
                  </b>
                  -->
                </span>
                <div @click="setKeyActionToOrderLine(keyValue)">
                  <el-image
                    v-if="ifImage(keyValue)"
                    :src="srcImage(keyValue)"
                    class="key-layout"
                    fit="contain"
                  />
                  <vue-content-loading v-else :width="300" :height="300" />
                </div>
                <div class="footer-product">
                  <p class="quantity">
                    Cantidad: {{ formatQuantity(keyValue.quantity) }}
                  </p>
                  <br>
                </div>
              </el-card>
            </el-col>
          </template>
        </el-row>
      </el-card>

      <el-card v-else>
        <el-image
          :src="defaultImage"
          class="error-layout"
          fit="contain"
        />
        <div class="error-product">
          <el-link
            @click="handleCommand"
          >
            {{ $t('form.pos.keyLayout.noProducto') }}
            <i class="el-icon-s-home" />
          </el-link>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
  .el-card__header {
    padding: 0px !important;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .key-layout {
    width: 100%;
    height: 200px;
    display: block;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .error-layout {
    width: 100%;
    height: 25%;
    display: block;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .price {
    height: 100%;
    font-size: 15px;
    width: 50%;
    text-align: right;
    padding: 0px !important;
    margin-top: 5px !important;
    margin-bottom: 10px !important;
    margin-left: 0px !important;
    margin-right: 7px !important;
  }
  .quantity {
    height: 100%;
    font-size: 13px;
    text-align: left;
    width: 50%;
    padding: 0px !important;
    margin-top: 5px !important;
    margin-bottom: 10px !important;
    margin-left: 7px !important;
    margin-right: 0px !important;
  }
  .footer-product {
    display: flex;
    width: 100%;
  }
  .error-product {
    width: 100%;
    text-align: center;
  }
  .el-main {
    display: block;
    box-sizing: border-box;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
</style>
