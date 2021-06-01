<template>
  <div v-if="!isListRecord" class="container-submenu-mobile container-context-menu">
    <!-- actions or process on container -->
    <el-dropdown
      size="mini"
      :hide-on-click="true"
      split-button
      trigger="click"
      @command="clickRunAction"
      @click="runAction(defaultActionToRun)"
    >
      {{ defaultActionName }}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          command="refreshData"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i class="el-icon-refresh" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('components.contextMenuRefresh') }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
         <el-dropdown-item
          :command="this.$t('data.addNote')"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i class="el-icon-notebook-2" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('data.addNote') }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.descriptionNote') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          v-for="(action, index) in actions"
          :key="index"
          :command="action"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i :class="iconAction(action)" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ action.name }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
         <el-dropdown-item
          command="shareLink"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i class="el-icon-copy-document" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('components.contextMenuShareLink') }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- menu relations -->
    <el-dropdown size="mini" @command="clickRelation">
      <el-button type="success" plain size="mini">
        {{ $t('components.contextMenuRelations') }} <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(relation, index) in relationsList"
          :key="index"
          :command="relation"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <svg-icon :name="relation.meta.icon" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ relation.meta.title }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ relation.meta.description }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown size="mini" @command="clickReferences">
      <el-button type="warning" plain :disabled="!(isReferencesContent && isLoadedReferences)" size="mini">
        {{ $t('components.contextMenuReferences') }}
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(reference, index) in references.referencesList"
          :key="index"
          :command="reference"
          :divided="true"
        >
          <div class="contents">
            <div>
              <span class="contents">
                <b class="label">
                  {{ reference.displayName }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style>
  .el-button-group > .el-button:not(:last-child) {
    margin-right: -1px;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .el-button-group > .el-button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-right: -1px;
    color: #409eff;
    background: #c3defd;
    border-color: #1682e6;
  }
</style>

<style lang="scss" scoped src='../style/contextMenuStyleScoped.scss'>
   .el-dropdown-menu {
    max-height: 250px;
    overflow: auto;
  }
</style>
