<template>
  <el-form>
    <el-form-item :label="$t('profile.currentRole')">
      {{ currentRole.name }}
    </el-form-item>

    <el-form-item :label="$t('profile.clientName')">
      {{ currentRole.clientName }}
    </el-form-item>

    <el-form-item :label="$t('profile.description')">
      {{ currentRole.description }}
    </el-form-item>

    <el-form-item :label="$t('profile.changeRole')">
      <el-select
        v-model="valueRol"
        :filterable="!isMobile"
        value-key="key"
        @change="handleChange"
      >
        <el-option
          v-for="(rol, key) in rolesList"
          :key="key"
          :label="rol.name"
          :value="rol.uuid"
          :disabled="!(rol.uuid)"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('profile.changeLanguage')">
      <el-select
        v-model="currentLanguage"
        :filterable="true"
        value-key="key"
        :placeholder="$t('profile.changeLanguagePlaceholder')"
        @visible-change="loadLanguageList"
        @change="changeLanguage"
      >
        <el-option
          v-for="item in languagesList"
          :key="item.value"
          :label="item.languageName"
          :value="item.languageISO"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
