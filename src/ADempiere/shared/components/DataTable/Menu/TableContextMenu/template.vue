<template>
  <el-menu
    :collapse="isCollapse"
  >
    <el-submenu
      index="xlsx"
      @click.native="exporRecordTable(defaultFromatExport)"
    >
      <template slot="title">
        {{ $t('data.exportRecord') }}
      </template>
      <el-menu-item
        v-for="(format, keyFormat) in supportedTypes"
        :key="keyFormat"
        :index="keyFormat"
        @click.native="exporRecordTable(keyFormat)"
      >
        {{ format }}
      </el-menu-item>
    </el-submenu>
    <el-menu-item
      v-if="panelType === 'window'"
      index="delete"
      @click="deleteRecord()"
    >
      {{ $t('window.deleteRecord') }}
    </el-menu-item>

    <!-- process associated -->
    <el-menu-item
      v-for="(process, key) in processMenu"
      :key="key"
      :index="'process' + key"
      @click="showModalTable(process)"
    >
      {{ process.name }}
    </el-menu-item>
  </el-menu>
</template>
