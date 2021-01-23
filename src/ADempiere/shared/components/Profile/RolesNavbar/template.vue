<template>
  <el-form>
    {{ $t('route.role') }}
    <el-select
      v-model="currentRoleUuid"
      :filterable="isFiltrable"
      value-key="key"
    >
      <el-option
        v-for="(role, key) in rolesList"
        :key="key"
        :label="role.name"
        :value="role.uuid"
        :disabled="!(role.uuid)"
      />
    </el-select>

    {{ $t('route.organization') }}
    <el-select
      v-model="currentOrganizationUuid"
      :filterable="isFiltrable"
      value-key="key"
      @visible-change="showOrganizationsList"
    >
      <el-option
        v-for="(organization, key) in organizationsList"
        :key="key"
        :label="organization.name"
        :value="organization.uuid"
        :disabled="!(organization.uuid)"
      />
    </el-select>

    {{ $t('route.warehouse') }}
    <el-select
      v-model="currentWarehouseUuid"
      :filterable="isFiltrable"
      value-key="key"
      @visible-change="showWarehouseList"
    >
      <el-option
        v-for="(warehouse, key) in warehousesList"
        :key="key"
        :label="warehouse.name"
        :value="warehouse.uuid"
        :disabled="!(warehouse.uuid)"
      />
    </el-select>
  </el-form>
</template>
