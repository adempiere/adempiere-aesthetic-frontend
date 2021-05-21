import { Component, Mixins, Watch } from 'vue-property-decorator'
import { IRecordAccessRoleDataExtended } from '../../../PrivateAccessType'
import MixinRecordAccess from '../MixinRecordAccess'
import Template from './template.vue'

@Component({
  name: 'RecordAccessMobile',
  mixins: [Template, MixinRecordAccess]
})
export default class RecordAccessMobile extends Mixins(MixinRecordAccess) {
  // Data
  group = 'sequence'
  isReadonly = false
  isDependentEntities = false
  public labelListInclude?: string[] = []
  public labelListExcludo?: string[] = []

  // Computed properties
  get listExclude(): string[] {
    return this.excludedList.map(element => {
      return element.roleName
    })
  }

  get listInclude(): string[] {
    return this.includedList.map(element => {
      return element.roleName
    })
  }

  get listRolesLock(): string[] {
    const list: IRecordAccessRoleDataExtended[] = this.includedList.filter((element: IRecordAccessRoleDataExtended) => {
      return !element.isExclude
    })
    if (list) {
      return list.map(element => {
        return element.roleName
      })
    }
    return []
  }

  set listRolesLock(value: string[]) { }

  get listRolesLockReadOnly(): string[] {
    const list: IRecordAccessRoleDataExtended[] = this.includedList.filter(element => {
      if (element.isExclude && element.isReadOnly) {
        return element
      }
    })
    if (list) {
      return list.map(element => {
        return element.roleName
      })
    }
    return []
  }

  set listRolesLockReadOnly(value: string[]) { }

  get listLabelRolesLockReadOnly(): string[] {
    const list: IRecordAccessRoleDataExtended[] = this.includedList.filter(element => {
      if (!element.isExclude && element.isReadOnly) {
        return element
      }
    })
    if (list) {
      return list.map(element => {
        return element.roleName
      })
    }
    return []
  }

  set listLabelRolesLockReadOnly(value: string[]) { }

  get listRolesUnLock(): string[] {
    const list: IRecordAccessRoleDataExtended[] = this.includedList.filter(element => {
      if (!element.isExclude && element.isDependentEntities) {
        return element
      }
    })
    if (list) {
      return list.map(element => {
        return element.roleName
      })
    }
    return []
  }

  set listRolesUnLock(value: string[]) { }

  // Watchers
  @Watch('listInclude')
  handleListIncludeChange(value: string[]) {
    this.labelListInclude = value
  }

  @Watch('listExclude')
  handleListExcludeChange(value: string[]) {
    this.labelListExcludo = value
  }

  // Methods

  addListInclude(element: string[]): void {
    const index: number = this.recordAccess.roles.findIndex(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index >= 0) {
      this.addItem({
        index,
        element: this.recordAccess.roles[index]
      })
    }
  }

  addListExclude(element: string[]): void {
    const index: number = this.recordAccess.roles.findIndex(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index >= 0) {
      this.deleteItem({
        index,
        element: this.recordAccess.roles[index]
      })
    }
  }

  addRolesLock(element: string[]) {
    const index: number = this.recordAccess.roles.findIndex(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index >= 0) {
      this.recordAccess.roles[index].isExclude = !this.recordAccess.roles[index].isExclude
    }
  }

  addRolesLockReadOnly(element: string[]) {
    const index: IRecordAccessRoleDataExtended | undefined = this.recordAccess.roles.find(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index) {
      index.isReadOnly = !index.isReadOnly
    } else {
      const undo = this.recordAccess.roles.find(item => {
        if (this.listRolesLockReadOnly[0] === item.roleName) {
          return item
        }
      })!
      undo.isReadOnly = !undo.isReadOnly
    }
  }

  addlockedRolesIsDependentEntities(element: string[]) {
    const index: IRecordAccessRoleDataExtended | undefined = this.recordAccess.roles.find(item => {
      if (element[element.length - 1] === item.roleName) {
        return item
      }
    })
    if (index) {
      index.isDependentEntities = !index.isDependentEntities
    } else {
      const undo = this.recordAccess.roles.find(item => {
        if (this.listRolesUnLock[0] === item.roleName) {
          return item
        }
      })!
      undo.isDependentEntities = !undo.isDependentEntities
    }
  }

  SendRecorAccess(list: IRecordAccessRoleDataExtended[]) {
    // list.forEach(element => {
    //   element.isReadOnly = this.isReadonly
    //   element.isDependentEntities = this.isDependentEntities
    // })
    this.saveRecordAccess(list)
  }
}
