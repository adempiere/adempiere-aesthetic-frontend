<template>
  <el-dropdown trigger="click">
    <el-button type="text" :disabled="fieldAttributes.readonly">
      <i class="el-icon-notebook-2 el-icon--right" @click="isActive = !isActive" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="dropdown-calc">
      <el-card
        v-if="metadataList.length"
        class="box-card"
      >
        <div slot="header" class="clearfix">
          <span>
            {{ $t('components.preference.title') }}
            <b>
              {{ fieldAttributes.name }}
            </b>
          </span>
        </div>
        <div v-if="descriptionOfPreference.length" class="text item">
          {{
            descriptionOfPreference
          }}
          <template
            v-for="(index) in fieldsListPreference"
          >
            <span
              v-if="index.value"
              :key="index.sequence"
            >
              {{
                index.label
              }}
            </span>
          </template>
        </div>
        <br>
        <div class="text item">
          <el-form
            :inline="true"
          >
            <el-form-item>
              <p slot="label">
                {{ fieldAttributes.name }}
              </p>
              <el-switch
                v-if="fieldAttributes.componentPath === 'FieldYesNo'"
                v-model="code"
                :active-text="$t('components.preference.yes')"
                :inactive-text="$t('components.preference.no')"
                :disabled="true"
                style="padding-top: 30%"
              />
              <div
                v-else
              >
                <p>
                  {{
                    code
                  }}
                </p>
              </div>
            </el-form-item>
          </el-form>
          <el-form
            label-position="top"
            :inline="true"
            class="demo-form-inline"
            size="medium"
          >
            <el-form-item
              v-for="(field) in metadataList"
              :key="field.sequence"
            >
              <p slot="label">
                {{ field.name }}
              </p>
              <el-switch
                v-model="field.value"
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
                @click="close()"
              />
            </samp>
          </el-col>
        </el-row>
      </el-card>
      <div
        v-else
        v-loading="!metadataList.length"
        :element-loading-text="$t('notifications.loading')"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        class="loading-window"
      />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style>
 .title {
    color: #000000;
    text-size-adjust: 20px;
    font-size: 120%;
    /* font-weight: 605!important;
    left: 50%; */
  }
  .value {
    color: #606266;
    text-size-adjust: 20px;
    font-size: 120%;
    /* font-weight: 605!important;
    left: 50%; */
  }
</style>
