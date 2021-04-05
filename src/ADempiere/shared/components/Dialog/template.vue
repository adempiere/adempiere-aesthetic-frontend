<template>
  <el-dialog
    :title="modalMetadata.name"
    :visible="isVisibleDialog"
    show-close
    :before-close="closeDialog"
    :width="width + '%'"
    top="5vh"
    close-on-press-escape
    close-on-click-modal
  >
    {{ modalMetadata.description }}<br><br>
    <div
    v-if="panelType !== 'From'"
    >
    <sequence-order
      v-if="modalMetadata.isSortTab"
      key="order"
      :parent-uuid="parentUuid"
      :container-uuid="modalMetadata.uuid"
      :order="modalMetadata.sortOrderColumnName"
      :included="modalMetadata.sortYesNoColumnName"
      :identifiers-list="modalMetadata.identifierColumns"
      :key-column="modalMetadata.keyColumn"
    />

    <template v-else>
      <main-panel
        v-if="(modalMetadata.uuid)"
        key="main-panel"
        :parent-uuid="parentUuid"
        :container-uuid="modalMetadata.uuid"
        :metadata="modalMetadata"
        :panel-type="modalMetadata.panelType"
      />
    </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        @click="closeDialog"
      >
        {{ $t('components.dialogCancelButton') }}
      </el-button>
      <el-button
        type="primary"
        @click="runAction(modalMetadata)"
      >
        {{ $t('components.dialogConfirmButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<style>
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 65vh;
    overflow: auto;
  }
</style>
