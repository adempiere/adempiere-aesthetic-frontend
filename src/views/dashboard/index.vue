<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import AdminDashboard from '@/ADempiere/shared/components/DashboardAdmin'
import EditorDashboard from './editor/index.vue'

@Component({
  name: 'Dashboard',
  components: {
    AdminDashboard,
    EditorDashboard
  }
})
export default class extends Vue {
  private currentRole = 'admin-dashboard'

  get roles() {
    return UserModule.roles
  }

  // created() {
  //   if (!this.roles.includes('admin')) {
  //     this.currentRole = 'editor-dashboard'
  //   }
  // }
}
</script>
