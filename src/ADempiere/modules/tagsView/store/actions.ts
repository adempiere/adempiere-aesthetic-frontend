import { IRootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ITagsViewState, ITagView } from '../TagsViewType'

type TagsViewActionContext = ActionContext<ITagsViewState, IRootState>
type TagsViewActionTree = ActionTree<ITagsViewState, IRootState>

export const actions: TagsViewActionTree = {
  addView(context: TagsViewActionContext, view: ITagView) {
    context.commit('ADD_VISITED_VIEW', view)
    context.commit('ADD_CACHED_VIEW', view)
  },
  addVisitedView(context: TagsViewActionContext, view: ITagView) {
    context.commit('ADD_VISITED_VIEW', view)
  },
  delView(context: TagsViewActionContext, view: ITagView) {
    context.commit('DEL_VISITED_VIEW', view)
    context.commit('DEL_CACHED_VIEW', view)
  },
  delCachedView(context: TagsViewActionContext, view: ITagView) {
    context.commit('DEL_CACHED_VIEW', view)
  },
  delOthersViews(context: TagsViewActionContext, view: ITagView) {
    context.commit('DEL_OTHERS_VISITED_VIEWS', view)
    context.commit('DEL_OTHERS_CACHED_VIEWS', view)
  },
  delAllViews(context: TagsViewActionContext) {
    context.commit('DEL_ALL_VISITED_VIEWS')
    context.commit('DEL_ALL_CACHED_VIEWS')
  },
  delAllCachedViews(context: TagsViewActionContext) {
    context.commit('DEL_ALL_CACHED_VIEWS')
  },
  updateVisitedView(context: TagsViewActionContext, view: ITagView) {
    context.commit('UPDATE_VISITED_VIEW', view)
  },
  setCustomTagView(context: TagsViewActionContext, isCloseAllViews = true) {
    const route = context.rootState.route
    const selectedTag: ITagView = {
      fullPath: route.fullPath,
      hash: route.hash,
      matched: route.matched,
      meta: route.meta,
      name: route.name,
      params: route.params,
      path: route.path,
      query: route.query,
      title: route.meta.title
    }

    if (isCloseAllViews) {
      context.dispatch('delAllViews')
    } else {
      context.dispatch('delOthersViews', selectedTag)
    }
  }
}
