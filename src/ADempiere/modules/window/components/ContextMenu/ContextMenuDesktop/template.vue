<template>
  <div class="container-submenu-mobile container-context-menu">
    <!-- actions or process on container -->
    <el-dropdown
      :hide-on-click="true"
      split-button
      type="primary"
      trigger="click"
      @command="clickRunAction"
      @click="runAction(defaultActionToRun)"
    >
      {{ defaultActionName }}
      <el-dropdown-menu slot="dropdown">
        <el-scrollbar wrap-class="scroll-child">
          <el-dropdown-item command="refreshData">
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
                <p class="description">
                  {{ $t('data.noDescription') }}
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
              <el-dropdown v-if="!isEmptyValue(action.childs)">
                <span class="contents">
                  <b class="label">
                    {{ action.name }}
                  </b>
                </span>
                <p class="description">
                  {{ $t('data.noDescription') }}
                </p>
                <el-dropdown-menu slot="dropdown" @command="handleCommand">
                  <el-dropdown-item
                    v-for="(childs, key) in action.childs"
                    :key="key"
                    :command="childs"
                    :divided="true"
                  >
                    <span class="contents">
                      <b class="label" @click="handleCommand(childs)">
                        {{ childs.name }}
                      </b>
                    </span>
                    <p
                      v-if="!isEmptyValue(childs.description)"
                      class="description"
                    >
                      {{ childs.description }}
                    </p>
                    <p v-else class="description">
                      {{ $t('data.noDescription') }}
                    </p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div v-else>
                <span class="contents">
                  <b class="label">
                    {{ action.name }}
                  </b>
                </span>
                <p class="description">
                  {{ $t('data.noDescription') }}
                </p>
              </div>
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="shareLink" :divided="true">
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
                <p class="description">
                  {{ $t('data.noDescription') }}
                </p>
              </div>
            </div>
          </el-dropdown-item>
        </el-scrollbar>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- menu relations -->
    <el-dropdown size="mini" trigger="click" @command="clickRelation">
      <el-button type="success" plain>
        {{ $t('components.contextMenuRelations') }}
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-scrollbar wrap-class="scroll-child">
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
                <p class="description">
                  {{ relation.meta.description }}
                </p>
              </div>
            </div>
          </el-dropdown-item>
        </el-scrollbar>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown size="mini" trigger="click" @command="clickReferences">
      <el-button
        type="warning"
        plain
        :disabled="!(isReferencesContent && isLoadedReferences)"
      >
        {{ $t('components.contextMenuReferences') }}
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-scrollbar wrap-class="scroll-child">
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
                <p class="description">
                  {{ $t('data.noDescription') }}
                </p>
              </div>
            </div>
          </el-dropdown-item>
        </el-scrollbar>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style>
.el-dropdown .el-button-group {
    display: inline-flex;
}
.el-dropdown-menu--medium .el-dropdown-menu__item {
  line-height: 17px;
  padding: 0 17px;
  display: grid;
  font-size: 14px;
}
.el-dropdown-menu--medium .el-dropdown-menu__item {
  line-height: 17px;
  padding: 0 17px;
  display: grid;
  font-size: 14px;
}
.el-button-group > .el-button:not(:last-child) {
  margin-right: -1px;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.el-button-group .el-button--primary:last-child {
  margin-right: 1px;
  color: #409eff;
  background: #e6f1fd;
  border-color: #b3d8ff;
  border-top-color: #b3d8ff;
  border-right-color: #b3d8ff;
  border-bottom-color: #b3d8ff;
  border-left-color: #000000 !important;
}
.el-dropdown .el-button-group:hover {
  background: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}
.el-button-group:hover {
  background: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}
.el-button-group .el-button--primary:hover {
  background: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}
</style>

<style lang="scss" scoped src='../style/contextMenuStyleScoped.scss'>
.el-dropdown-menu {
    max-height: 300px;
    overflow: hidden;
  }
</style>
