<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        <b>
          {{ $t('form.pos.collect.convertAmount') }}:
          {{ formatPrice(amount * convert, displayCurrency) }}
        </b>
      </span>
    </div>
    <div class="text item">
      <el-row>
        <el-col :span="24">
          <el-form
            label-position="top"
            label-width="10px"
            style="float: right; display: flex; line-height: 10px;"
          >
            <span v-for="(field, index) in fieldsList" :key="index">
              <FieldDefinition
                :key="field.columnName"
                :metadata-field="field"
              />
            </span>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
