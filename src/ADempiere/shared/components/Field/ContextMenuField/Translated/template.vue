<template>
  <el-card class="box-card" style="padding: 1%;">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('field.field') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>
    <div>
      <el-form ref="form" label-position="top">
        <el-form-item :label="$t('field.container.description')">
          {{ fieldAttributes.description }}
        </el-form-item>
        <el-form-item :label="$t('field.container.help')">
          {{ fieldAttributes.help }}
        </el-form-item>
        <el-form-item
          :required="true"
        >
          <template slot="label">
            {{ $t('language') + ':' }}
          </template>
          <el-select
            v-model="langValue"
            size="medium"
            style="width: 100%;"
            filterable
          >
            <!-- <el-option
              key="blank-option"
              :value="undefined"
              label=" "
            /> -->
            <el-option
              v-for="(optionLang, key) in languageList"
              :key="key"
              :value="optionLang.language"
              :label="optionLang.languageName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('field.codeTranslation') + fieldAttributes.name"
          :required="true"
        >
          <el-input
            v-model="translatedValue"
            :disabled="isEmptyValue(langValue)"
          />
        </el-form-item>
      </el-form>
    </div>
    <br>
    <el-row>
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-address-location"
            icon="el-icon-close"
            @click="close()"
          />
          <el-button
            type="primary"
            class="custom-button-address-location"
            icon="el-icon-check"
            @click="changeTranslationValue(translatedValue)"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style lang="scss">
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
</style>
