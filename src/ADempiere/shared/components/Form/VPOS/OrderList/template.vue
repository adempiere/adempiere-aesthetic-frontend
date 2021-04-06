<template>
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          Ver Histórico de Órdenes
        </template>
        <el-form
          v-if="isLoaded"
          label-position="top"
          label-width="10px"
          @submit.native.prevent="notSubmitForm"
        >
          <template
            v-for="(field) in fieldsList"
          >
            <FieldDefinition
              :key="field.columnName"
              :metadata-field="field"
            />
          </template>
        </el-form>
        <div
          v-else
          key="form-loading"
          v-loading="!isLoaded"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          class="loading-panel"
        />
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="orderTable"
      v-shortkey="shortsKey"
      v-loading="!tableOrder.isLoaded"
      :data="ordersList"
      border
      fit
      :highlight-current-row="highlightRow"
      :height="heightTable"
      @shortkey.native="keyAction"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="documentNo"
        label="Nro. Documento"
        width="130"
      />

      <el-table-column
        label="Estado"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            :type="tagStatus(scope.row.documentStatus.value)"
          >
            {{ scope.row.documentStatus.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="salesRepresentative.name"
        label="Agente Comercial"
        min-width="170"
      />

      <el-table-column
        label="Socio de Negocio"
        min-width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.businessPartner.name }}
        </template>
      </el-table-column>

      <el-table-column
        label="Fecha de Orden"
        width="135"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.dateOrdered) }}
        </template>
      </el-table-column>
      <el-table-column
        label="Total General"
        align="right"
        width="120"
      >
        <template slot-scope="scope">
          {{ formatQuantity(scope.row.grandTotal) }}
        </template>
      </el-table-column>
    </el-table>

    <custom-pagination
      :total="tableOrder.recordCount"
      :current-page="tableOrder.pageNumber"
      :handle-change-page="handleChangePage"
    />
  </el-main>
</template>
