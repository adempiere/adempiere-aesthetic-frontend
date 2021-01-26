<template>
  <el-footer style="height: 30px;">
    <div style="float: right;">
      <el-pagination
        small
        layout="slot, total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleChangePageFunction"
      >
        <template v-slot>
          <span v-if="isSelection">
            {{ $t('table.dataTable.selected') }}: {{ selection }} / <!-- show total records -->
          </span>
        </template>
      </el-pagination>
    </div>
  </el-footer>
</template>
