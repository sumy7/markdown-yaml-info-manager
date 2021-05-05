import { createStore } from 'vuex'
import VueI18N from '../i18n/index'

import categories from '@/store/categories'
import posts from '@/store/posts'
import tags from '@/store/tags'
import {
  ACTION_FIRST_LOAD_POST_FILE_INFO,
  ACTION_SET_LOCALE,
  ACTION_SET_POST_FILE_INFO,
  MUTATION_SET_LOADED,
  MUTATION_SET_LOCALE,
  MUTATION_SET_ROOT_PATH
} from '@/store/events'
import { PostFileInfo } from '@/utils/posts'
import postTag from '@/store/postTag'
import postCategory from '@/store/postCategory'

export interface RootStateType {
  loaded: boolean,
  rootPath: string,
  locale: {
    choose: string,
    system: string
  }
}

export default createStore<RootStateType>({
  state: {
    loaded: false,
    rootPath: '',
    locale: {
      choose: 'auto',
      system: 'zh'
    }
  },
  mutations: {
    [MUTATION_SET_ROOT_PATH] (state, payload) {
      state.rootPath = payload
    },
    [MUTATION_SET_LOADED] (state, payload) {
      state.loaded = payload
    },
    [MUTATION_SET_LOCALE] (state, payload) {
      if (payload.system) {
        state.locale.system = payload.system
      }
      if (payload.choose) {
        state.locale.choose = payload.choose
      }
    }
  },
  actions: {
    async [ACTION_FIRST_LOAD_POST_FILE_INFO] ({
      commit,
      dispatch
    }, postFileInfo: PostFileInfo[]) {
      await dispatch(ACTION_SET_POST_FILE_INFO, postFileInfo)
      commit(MUTATION_SET_LOADED, true)
    },
    [ACTION_SET_LOCALE] ({
      commit,
      getters
    }, payload) {
      commit(MUTATION_SET_LOCALE, payload)
      VueI18N.global.locale.value = getters.locale
    }
  },
  getters: {
    locale: (state): string => {
      if (state.locale.choose === 'auto') {
        return state.locale.system
      }
      return state.locale.choose
    }
  },
  modules: {
    posts,
    categories,
    tags,
    postTag,
    postCategory
  }
})
