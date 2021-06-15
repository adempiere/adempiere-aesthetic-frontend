<template>
  <div>
    <el-dropdown
      v-if="isMobile"
      key="options-mobile"
      size="mini"
      hide-on-click
      trigger="click"
      :style="'text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:' + labelStyle + '%'"
      @command="handleCommand"
      @click="false"
    >
      <div style="display: flex;width: auto;">
        <span :style="metadata.required && isEmptyValue(valueField) ? 'border: aqua; color: #f34b4b' : 'border: aqua;'">
          <span key="is-field-name">
            <!-- label or name of field in mobile -->
            {{ metadata.name }}
          </span>
        </span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <template
          v-for="(option, key) in optionsList"
        >
          <el-dropdown-item
            v-if="option.enabled"
            :key="key"
            :command="option"
            divided
          >
            <div class="contents">
              <div
                v-if="option.svg"
                key="icon-svg-mobile"
                style="margin-right: 5%"
              >
                <svg-icon :icon-class="option.icon" style="margin-right: 5px;" />
              </div>
              <div
                v-else
                key="icon-mobile"
                style="margin-right: 5%;padding-top: 3%;"
              >
                <i :class="option.icon" style="font-weight: bolder;" />
              </div>
              <div>
                <span class="contents">
                  <b class="label">
                    {{ option.name }}
                  </b>
                </span>
              </div>
            </div>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>

    <el-menu
      v-else-if="!isMobile && metadata.panelType !== 'form'"
      key="options-desktop"
      class="el-menu-demo"
      mode="horizontal"
      unique-opened
      style="z-index: 0"
      :menu-trigger="triggerMenu"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
    >
      <el-submenu index="menu">
        <template slot="title">
          <div style="display: block;">
            <span :style="metadata.required && isEmptyValue(valueField) ? 'border: aqua; color: #f34b4b' : 'border: aqua;'">
              <span key="is-field-name">
                <!-- label or name of field in desktop -->
                {{ metadata.name }}
              </span>
            </span>
          </div>
        </template>
        <el-menu-item
          v-for="(option, key) in optionsList"
          :key="key"
          :index="option.name"
        >
          <el-popover
            placement="top"
            trigger="click"
            style="padding: 0px; max-width: 400px"
            @hide="closePopover"
          >
            <component
              :is="option.componentRender"
              v-if="visibleForDesktop && showPanelFieldOption"
              :field-attributes="fieldAttributes"
              :field-value="valueField"
            />
            <el-button slot="reference" type="text" style="color: #606266;">
              <div class="contents">
                <div
                  v-if="option.svg"
                  key="icon-svg-desktop"
                  style="margin-right: 5%;; padding-left: 2%;"
                >
                  <svg-icon :icon-class="option.icon" style="margin-right: 5px;" />
                </div>
                <div
                  v-else
                  key="icon-desktop"
                  style="margin-right: 5%;padding-top: 3%;"
                >
                  <i :class="option.icon" style="font-weight: bolder;" />
                </div>
                <div>
                  <span class="contents">
                    <b class="label">
                      {{ option.name }}
                    </b>
                  </span>
                </div>
              </div>
            </el-button>
          </el-popover>
        </el-menu-item>
      </el-submenu>
    </el-menu>

    <span v-else key="options-form">
      <!-- label or name of field in form -->
      {{ metadata.name }}
    </span>
  </div>
</template>

<style>
.el-popover {
  position: fixed;
  padding: 0px;
}
.el-textarea {
  position: relative;
  width: 100%;
  vertical-align: bottom;
  font-size: 14px;
  display: flex;
}
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 60px;
  line-height: 60px;
  border-bottom: 2px solid transparent;
  color: #535457e3;
}
</style>
<style scoped>
.el-form--label-top .el-form-item__label {
  padding-bottom: 0px !important;
  display: block;
}
.el-menu.el-menu--horizontal {
  border-bottom: solid 0px #E6E6E6;
}
.svg-icon {
  width: 1em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.el-dropdown .el-button-group {
  display: flex;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 0px;
  margin: 0px;
  background-color: #FFFFFF;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 250px;
  max-width: 220px;
  overflow: auto;
}
.el-dropdown-menu--mini .el-dropdown-menu__item {
  line-height: 14px;
  padding: 0px 15px;
  padding-top: 1%;
  padding-right: 15px;
  padding-bottom: 1%;
  padding-left: 15px;
  font-size: 10px;
}
.el-dropdown-menu__item--divided {
  position: relative;
  /* margin-top: 6px; */
  border-top: 1px solid #e6ebf5;
}
.label {
  font-size: 14px;
  margin-top: 0% !important;
  margin-left: 0px;
  text-align: initial;
}
.description {
  margin: 0px;
  font-size: 12px;
  text-align: initial;
}
.contents {
  display: inline-flex;
}
</style>
