import { createStore } from 'vuex'

import categories from '@/store/categories'
import posts from '@/store/posts'
import tags from '@/store/tags'
import {
  ACTION_FIRST_LOAD_POST_FILE_INFO,
  ACTION_SET_POST_FILE_INFO,
  MUTATION_SET_LOADED,
  MUTATION_SET_ROOT_PATH
} from '@/store/events'
import { PostFileInfo } from '@/utils/posts'
import postTag from '@/store/postTag'

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
    async [ACTION_FIRST_LOAD_POST_FILE_INFO] ({
      commit,
      dispatch
    }, postFileInfo: PostFileInfo[]) {
      await dispatch(ACTION_SET_POST_FILE_INFO, postFileInfo)
      commit(MUTATION_SET_LOADED, true)
    }
  },
  modules: {
    posts,
    categories,
    tags,
    postTag
  }
})
