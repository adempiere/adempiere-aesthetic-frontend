<template>
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          Business Partner
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
        label="Key"
        prop="value"
        width="180"
      />
      <el-table-column
        label="ID"
        prop="id"
        width="100"
      />
      <el-table-column
        prop="name"
        label="Name"
      />
      <el-table-column
        label="Last Name"
        prop="lastName"
      />
      <el-table-column
        label="NAICS"
        prop="naics"
        width="100"
      />
      <el-table-column
        label="Tax ID"
        prop="taxId"
        align="right"
        width="100"
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
