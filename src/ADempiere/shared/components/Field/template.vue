<template>
  <!--
    this v-show is to indicate that if the field is not shown,
    therefore you should not leave the column size spacing of your
    <el-col></el-col> container-->
  <div v-if="!inTable">
    <el-col
      v-if="isDisplayed"
      key="is-panel-template"
      :xs="sizeFieldResponsive.xs"
      :sm="sizeFieldResponsive.sm"
      :md="sizeFieldResponsive.md"
      :lg="sizeFieldResponsive.lg"
      :xl="sizeFieldResponsive.xl"
      :class="classField"
    >
      <el-form-item>
        <template slot="label">
          <el-dropdown
            v-if="isMobile"
            size="mini"
            :hide-on-click="true"
            trigger="click"
            :style="isMobile ? 'text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:'+labelStyle+'%' : ''"
            @command="handleCommand"
            @click="false"
          >
            <div :style="isMobile ? 'display: flex;width: auto;' : 'display: block;'">
              <span :style="isMandatory && isEmptyValue(valueField) ? 'border: aqua; color: #f34b4b' : 'border: aqua;'">
                <span key="is-field-name">
                  {{ field.name }}
                </span>
              </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <template
                v-for="(option, key) in optionField"
              >
                <el-dropdown-item
                  v-if="option.enabled"
                  :key="key"
                  :command="option"
                  :divided="true"
                >
                  <el-popover
                    v-if="!isMobile"
                    placement="top"
                    trigger="click"
                    style="padding: 0px;"
                  >
                    <component
                      :is="optionFieldFComponentRender"
                      v-if="visibleForDesktop"
                      :field-attributes="contextMenuField.fieldAttributes"
                      :source-field="contextMenuField.fieldAttributes"
                      :field-value="contextMenuField.valueField"
                    />
                    <el-button slot="reference" type="text" style="color: #606266;">
                      <div class="contents">
                        <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                          <i :class="option.icon" style="font-weight: bolder;" />
                        </div>
                        <div v-else style="margin-right: 5%">
                          <svg-icon :name="option.icon" :icon-class="option.icon" style="margin-right: 5px;" />
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
                  <div v-if="isMobile" class="contents">
                    <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                      <i :class="option.icon" style="font-weight: bolder;" />
                    </div>
                    <div v-else style="margin-right: 5%">
                      <svg-icon :name="option.icon" :icon-class="option.icon" style="margin-right: 5px;" />
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
          <el-menu v-else-if="field.panelType !== 'form' && !isMobile" class="el-menu-demo" mode="horizontal" :unique-opened="true" style="z-index: 0" :menu-trigger="triggerMenu" @open="handleOpen" @close="handleClose" @select="handleSelect">
            <el-submenu index="menu">
              <template slot="title">
                <div :style="isMobile ? 'display: flex;width: auto;' : 'display: block;'">
                  <span :style="isMandatory && isEmptyValue(valueField) ? 'border: aqua; color: #f34b4b' : 'border: aqua;'">
                    <span key="is-field-name">
                      {{ field.name }}
                    </span>
                  </span>
                </div>
              </template>
              <el-menu-item
                v-for="(option, key) in listOption"
                :key="key"
                :index="option.name"
              >
                <el-popover
                  v-if="!isMobile"
                  placement="top"
                  width="400"
                  trigger="click"
                  style="padding: 0px;"
                  @hide="closePopover"
                >
                  <component
                    :is="optionFieldFComponentRender"
                    v-if="visibleForDesktop"
                    :field-attributes="contextMenuField.fieldAttributes"
                    :source-field="contextMenuField.fieldAttributes"
                    :field-value="contextMenuField.valueField"
                  />
                  <el-button slot="reference" type="text" style="color: #606266;">
                    <div class="contents">
                      <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                        <i :class="option.icon" style="font-weight: bolder;" />
                      </div>
                      <div v-else style="margin-right: 5%; padding-left: 2%;">
                        <svg-icon :name="option.icon" :icon-class="option.icon" style="margin-right: 5px;" />
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
                <div v-if="false" class="contents">
                  <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                    <i :class="option.icon" style="font-weight: bolder;" />
                  </div>
                  <div v-else style="margin-right: 5%">
                    <svg-icon :name="option.icon" :icon-class="option.icon" style="margin-right: 5px;" />
                  </div>
                  <div>
                    <span class="contents">
                      <b class="label">
                        {{ option.name }}
                      </b>
                    </span>
                  </div>
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          <span v-else>
            {{ field.name }}
          </span>
        </template>
        <el-popover
          v-if="openOptionField && !isEmptyValue(optionColumnName) && (optionColumnName === field.columnName) && showPopoverPath"
          v-model="openOptionField"
          placement="top-start"
          width="400"
          trigger="click"
        >
          <component
            :is="optionFieldFComponentRender"
            :field-attributes="fieldAttributes"
            :source-field="fieldAttributes"
            :field-value="valueField"
          />
          <el-button slot="reference" type="text" :disabled="true" @click="openOptionField = !openOptionField" />
        </el-popover>
        <component
          :is="componentRender"
          :ref="field.columnName"
          :metadata="fieldAttributes"
          :value-model="recordDataFields"
        />
      </el-form-item>
    </el-col>
  </div>
  <component
    :is="componentRender"
    v-else
    key="is-table-template"
    :class="classField"
    :metadata="fieldAttributes"
    :value-model="recordDataFields"
    :in-table="true"
  />
</template>

<style scoped>
.el-form--label-top .el-form-item__label {
  padding-bottom: 0px !important;
  display: block;
}
</style>
<style>
.el-popper {
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

<style lang="scss">
  .el-popover {
      position: fixed;
  }
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
    float: left;
  }

  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }

  .in-table {
    margin-bottom: 0px !important;
    margin-left: 0px;
    margin-right: 0px;
  }

  /* Global Styles */
  .el-textarea__inner:not(.in-table) {
    min-height: 36px !important;
    /*
    height: 36px auto !important;
    max-height: 54.2333px !important;
    */
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
  .pre-formatted {
    white-space: pre;
  }
</style>
