<template>
  <el-card style="margin-bottom:20px;">
    <div
      slot="header"
      class="clearfix"
    >
      <span>{{ $t('profile.aboutMe') }}</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          :image="avatarResize"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        >
          <div>Hello</div>
          {{ currentRole.name }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">
          {{ currentRole.name }}
        </div>
        <br />

        <div class="user-role text-center text-muted">
        <div class="user-header">
          {{ $t('profile.availableRoles') }}
        </div>
        <li v-for="(item, key) in rolesList" :key="key">
          {{ item.name | uppercaseFirstChar }}
        </li>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon name="education" /><span>Education</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            JS in Computer Science from the University of Technology
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon name="skill" /><span>Skills</span>
        </div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="51" />
          </div>
          <div class="progress-item">
            <span>Typescript</span>
            <el-progress :percentage="45" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="4" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress
              :percentage="100"
              status="success"
            />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IProfile } from '../index.vue'
import PanThumb from '@/components/PanThumb/index.vue'
import { getImagePath } from '@/ADempiere/shared/utils/resource'

@Component({
  name: 'UserCard',
  components: {
    PanThumb
  }
})
export default class extends Vue {
  @Prop({ required: true }) private user!: IProfile

  // Computed properties
  get currentRole() {
    return this.$store.state.user.role
  }

  get rolesList() {
    return this.$store.state.user.rolesList
    // return this.$store.getters['user/getRoles']
  }

  get avatarResize(): string {
    const defaultAvatar = 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/80/h/80'
    if (!(this.user.avatar) || defaultAvatar.includes(this.user.avatar)) {
      return defaultAvatar
    }

    const { uri } = getImagePath({
      file: this.user.avatar,
      width: 100,
      height: 100
    })

    return uri
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
    .user-header {
      border-bottom: 1px solid #dfe6ec;
      font-weight: bold;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
