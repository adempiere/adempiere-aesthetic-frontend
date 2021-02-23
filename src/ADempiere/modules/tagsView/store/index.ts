import { IRootState } from '@/store'
import { Module } from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { ITagsViewState } from '../TagsViewType'

export const tagsView: Module<ITagsViewState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}
