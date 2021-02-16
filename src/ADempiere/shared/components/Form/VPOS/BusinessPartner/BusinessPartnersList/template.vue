<template>
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
          <template v-if="(parentMetadata.name)">
            ({{ parentMetadata.name }})
          </template>
          <!-- <i class="el-icon-circle-plus" /> -->
        </template>
        <el-form
          label-position="top"
          size="small"
        >
          <el-row>
            <field-definition
              v-for="(field) in fieldList"
              :key="field.columnName"
              :metadata-field="{...field, definition: field.overwriteDefinition}"
            />
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="businesPartnerTable"
      :data="businessPartnersList"
      highlight-current-row
      border
      fit
      height="350"

      @current-change="handleCurrentChange"
    >
      <el-table-column
        :label="$t('form.productInfo.code')"
        prop="value"
        width="100"
      />
      <el-table-column
        :label="$('form.productInfo.id')"
        prop="id"
        width="90"
      />
      <el-table-column
        prop="name"
        :label="$t('form.productInfo.name')"
      />
      <el-table-column
        :label="$t('form.productInfo.lastName')"
        prop="lastName"
      />
      <el-table-column
        :label="$t('form.pos.order.BusinessPartnerCreate.taxId')"
        prop="taxId"
        align="right"
      />
    </el-table>
    <custom-pagination
      :total="businessParners.recordCount"
      :current-page="1"
      :handle-change-page="handleChangePage"
    />
    <!-- -->
  </el-main>
</template>
