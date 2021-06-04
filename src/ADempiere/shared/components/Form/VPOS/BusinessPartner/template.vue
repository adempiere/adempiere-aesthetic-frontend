<template>
  <el-form-item>
    <template slot="label">
      {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
      <el-popover
        v-model="showCreate"
        placement="right"
        width="400"
        trigger="click"
      >
        <business-partner-create
          :parent-metadata="parentMetadata"
          :show-field="showCreate"
        />
        <el-button
          slot="reference"
          type="text"
          :disabled="isDisabled"
          @click="popoverOpen"
        >
          <i
            class="el-icon-circle-plus"
          />
        </el-button>
      </el-popover>
      <el-popover
        placement="right"
        width="800"
        trigger="click"
        :disabled="isDisabled"
        @hide="showFieldList = !showFieldList"
      >
        <business-partners-list
          :parent-metadata="parentMetadata"
          :shows-popovers="showsPopovers"
          :show-field="showFieldList"
        />
        <el-button
          slot="reference"
          type="text"
          @click="showFieldList = !showFieldList"
        >
          <i
            class="el-icon-search"
          />
        </el-button>
      </el-popover>
    </template>
    <el-autocomplete
      v-model="displayedValue"
      :placeholder="$t('quickAccess.searchWithEnter')"
      :fetch-suggestions="localSearch"
      clearable
      value-key="name"
      style="width: 100%;"
      popper-class="custom-field-bpartner-info"
      :disabled="isDisabled"
      @clear="setBusinessPartner(blankBPartner, false)"
      @keyup.enter.native="getBPartnerWithEnter"
      @select="handleSelect"
      @focus="setNewDisplayedValue"
      @blur="setOldDisplayedValue"
    >
      <template
        slot="prefix"
      >
        <i
          class="el-icon-user-solid el-input__icon"
        />
      </template>

      <template slot-scope="props">
        <div class="header">
          <b>{{ props.item.name }} </b>
        </div>
        <span class="info">
          {{ props.item.value }}
        </span>
      </template>
    </el-autocomplete>
  </el-form-item>
</template>

<style lang="scss" scope>
  .custom-field-bpartner-info {
    li {
      line-height: normal;
      padding: 15px;

      .header {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .info {
        color: #7e7e7e;
        float: left;
        font-size: 12px;
      }
    }
  }
</style>
