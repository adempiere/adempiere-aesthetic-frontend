<template>
  <div>
    <el-popover
      ref="businessPartnerCreate"
      v-model="showsPopovers.isShowCreate"
      placement="right"
      width="400"
      trigger="click"
    >
      <business-partner-create
        v-if="showsPopovers.isShowCreate"
        :parent-metadata="parentMetadata"
        :shows-popovers="showsPopovers"
      />
    </el-popover>

    <el-popover
      ref="businessPartnersList"
      v-model="showsPopovers.isShowList"
      placement="right"
      width="800"
      trigger="click"
    >
      <!-- v-if="showsPopovers.isShowList" -->
      <business-partners-list
        :parent-metadata="parentMetadata"
        :shows-popovers="showsPopovers"
      />
    </el-popover>

    <el-form-item>
      <template slot="label">
        Business Partner
        <i
          v-popover:businessPartnerCreate
          class="el-icon-circle-plus"
        />
        <i
          v-popover:businessPartnersList
          class="el-icon-search"
        />
      </template>

      <el-autocomplete
        v-model="displayedValue"
        :placeholder="$t('quickAccess.searchWithEnter')"
        :fetch-suggestions="localSearch"
        clearable
        value-key="name"
        style="width: 100%;"
        popper-class="custom-field-bpartner-info"
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
  </div>
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
