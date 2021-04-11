import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import { PostFileInfo } from '@/utils/posts'
import { MUTATION_SET_POST_FILE_INFOS } from '@/store/events'

export interface StatePostFileInfo extends PostFileInfo {
  changed: boolean
}

export interface PostsStateType {
  fileInfos: StatePostFileInfo[]
}

const postsModule: Module<PostsStateType, RootStateType> = {
  state: {
    fileInfos: []
  },
  mutations: {
    [MUTATION_SET_POST_FILE_INFOS] (state, payload) {
      for (const info of payload) {
        info.changed = false
      }
      state.fileInfos = payload
    }
  },
  actions: {},
  getters: {
    getChangedFileInfos (state): StatePostFileInfo[] {
      return state.fileInfos.filter((info) => info.changed)
    }
  }
}

export default postsModule
