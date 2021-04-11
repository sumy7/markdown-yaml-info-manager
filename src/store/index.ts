import { createStore } from 'vuex'

import categories from '@/store/categories'
import posts from '@/store/posts'
import tags from '@/store/tags'
import {
  ACTION_SET_POST_FILE_INFO,
  MUTATION_SET_LOADED,
  MUTATION_SET_POST_FILE_INFOS,
  MUTATION_SET_ROOT_PATH
} from '@/store/events'
import { PostFileInfo } from '@/utils/posts'

export interface RootStateType {
  loaded: boolean,
  rootPath: string,
}

export default createStore<RootStateType>({
  state: {
    loaded: false,
    rootPath: ''
  },
  mutations: {
    [MUTATION_SET_ROOT_PATH] (state, payload) {
      state.rootPath = payload
    },
    [MUTATION_SET_LOADED] (state, payload) {
      state.loaded = payload
    }
  },
  actions: {
    [ACTION_SET_POST_FILE_INFO] ({ commit }, postFileInfo: PostFileInfo[]) {
      commit(MUTATION_SET_POST_FILE_INFOS, postFileInfo)
      commit(MUTATION_SET_LOADED, true)
    }
  },
  modules: {
    posts,
    categories,
    tags
  }
})
