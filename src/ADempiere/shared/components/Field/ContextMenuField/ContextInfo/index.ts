import { IContextInfoValuesExtends } from '@/ADempiere/modules/persistence'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue, recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import MixinContextMenuField from '../MixinContextMenuField'
import Template from './template.vue'

@Component({
  name: 'FieldContextInfo',
  mixins: [Template]
})
export default class FieldContextInfo extends Mixins(MixinContextMenuField) {
    @Prop({ type: Object, required: true }) fieldAttributes!: any
    @Prop({ type: [Number, String, Boolean, Array, Object, Date], default: undefined }) fieldValue?: [Number, String, Boolean, any[], Object, Date]
    // eslint-disable-next-line
    // @ts-ignore
    public value?: [Number, String, Boolean, any[], Object, Date] = this.fieldValue

    // Computed properties
    get permissionRoutes(): RouteConfig[] {
      return this.$store.getters.permission_routes
    }

    get messageText(): string {
      if (!isEmptyValue(this.fieldAttributes.contextInfo.sqlStatement)) {
        const contextInfo: IContextInfoValuesExtends | undefined = this.$store.getters[Namespaces.BusinessData + '/' + 'getContextInfoField'](this.fieldAttributes.contextInfo.uuid, this.fieldAttributes.contextInfo.sqlStatement)
        if (isEmptyValue(contextInfo)) {
          return ''
        }
        return contextInfo!.messageText
      }
      return ''
    }

    // Watcher
    @Watch('fieldValue')
    handleFieldValueChange(value: [Number, String, Boolean, any[], Object, Date]) {
      this.value = value
    }

    // Methods
    notSubmitForm(event: any) {
      event.preventDefault()
      return false
    }

    redirect(params: { window: any }): void {
      const { window } = params
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            tabParent: (0).toString(),
            [this.fieldAttributes.columnName]: (this.value)?.toString()
          }
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('notifications.noRoleAccess').toString()
        })
      }
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', false)
      if (!isEmptyValue(this.$route.query.fieldColumnName)) {
        this.$router.push({
          name: this.$route.name!,
          query: {
            ...this.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
      }
    }

    // Hooks
    created() {
      if (isEmptyValue(this.messageText)) {
        const sqlParse = parseContext({
          parentUuid: this.fieldAttributes.parentUuid,
          containerUuid: this.fieldAttributes.containerUuid,
          value: this.fieldAttributes.contextInfo.sqlStatement,
          isBooleanToString: true
        })
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'getContextInfoValueFromServer', {
          contextInfoId: this.fieldAttributes.contextInfo.id,
          contextInfoUuid: this.fieldAttributes.contextInfo.uuid,
          sqlStatement: sqlParse.value
        })
      }
    }
}
