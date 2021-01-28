import {
  FormDefinitionState,
  IFormData,
  IFormDataExtended,
  requestForm
} from '@/ADempiere/modules/dictionary'
import language from '@/ADempiere/shared/lang'
import { ActionTree, ActionContext } from 'vuex'
import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type FormDefinitionActionTree = ActionTree<FormDefinitionState, IRootState>
type FormDefinitionActionContext = ActionContext<FormDefinitionState, IRootState>

export const actions: FormDefinitionActionTree = {
  addForm(
    context: FormDefinitionActionContext,
    metadataForm: { uuid: string }
  ) {
    if (!context.getters.getForm(metadataForm.uuid)) {
      context.commit('addForm', metadataForm)
    }
  },
  getFormFromServer(
    context: FormDefinitionActionContext,
    payload: {
            id: number
            containerUuid: string
            routeToDelete: string
        }
  ) {
    const { id, containerUuid, routeToDelete } = payload
    return new Promise((resolve) => {
      requestForm({
        uuid: containerUuid,
        id
      })
        .then((formResponse: IFormData) => {
          const panelType = 'form'

          // Panel for save on store
          const newForm: IFormDataExtended = {
            ...formResponse,
            containerUuid,
            fieldsList: [],
            panelType
          }

          context.commit('addForm', newForm)
          // dispatch('addPanel', newForm)

          resolve(newForm)

          // Convert from gRPC process list
          const actions: any[] = []

          // Add process menu
          context.dispatch(Namespaces.ContextMenu + '/' + 'setContextMenu', {
            containerUuid,
            actions
          }, { root: true })
        })
        .catch(error => {
          // router.push(
          //   {
          //     path: '/dashboard'
          //   },
          //   () => {
          //     return true
          //   }
          // )
          context.dispatch('tagsView/delView', routeToDelete, { root: true })
          showMessage({
            message: language.t('login.unexpectedError').toString(),
            type: 'error'
          })
          console.warn(
                        `Dictionary form - Error ${error.code}: ${error.message}.`
          )
        })
    })
  },
  changeFormAttribute(
    context: FormDefinitionActionContext,
    payload: {
            containerUuid: string
            form?: any
            attributeName: string
            attributeNameControl: string
            attributeValue: string
        }
  ) {
    let {
      form,
      containerUuid,
      attributeName,
      attributeNameControl,
      attributeValue
    } = payload
    if (form) {
      form = context.getters.getForm(containerUuid)
    }
    context.commit('changeFormAttribute', {
      form,
      attributeName,
      attributeValue,
      attributeNameControl
    })
  }
}
