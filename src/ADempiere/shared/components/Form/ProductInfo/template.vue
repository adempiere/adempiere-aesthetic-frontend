<template>
  <div>
    <product-info-list />
  </div>
</template>

<style lang="scss" scope>
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
