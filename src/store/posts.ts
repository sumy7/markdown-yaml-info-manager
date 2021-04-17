import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import { PostFileInfo } from '@/utils/posts'
import { ACTION_SET_POST_FILE_INFO, MUTATION_SET_POST_FILE_INFOS } from '@/store/events'
import { nanoid } from 'nanoid'
import _ from 'lodash'
import { TAG_NO_TAG } from '@/store/tags'

export interface StatePostFileInfo {
  id: string,
  postInfo: PostFileInfo,
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
    addPost (state, payload) {
      state.fileInfos.push(payload)
    },
    clearPost: (state) => {
      state.fileInfos = []
    },
    [MUTATION_SET_POST_FILE_INFOS] (state, payload) {
      for (const info of payload) {
        info.changed = false
      }
      state.fileInfos = payload
    }
  },
  actions: {
    addPost ({
      commit,
      rootGetters
    }, postFileInfo: PostFileInfo) {
      const post: StatePostFileInfo = {
        id: nanoid(),
        postInfo: postFileInfo,
        changed: false
      }
      commit('addPost', post)

      if (postFileInfo.tags) {
        for (const tagName of postFileInfo.tags) {
          let tag = rootGetters.findTagByName(tagName)
          if (!tag) {
            commit('addTag', { name: tagName })
            tag = rootGetters.findTagByName(tagName)
          }
          commit('addPostTagRel', {
            postId: post.id,
            tagId: tag.id
          })
        }
      } else {
        commit('addPostTagRel', {
          postId: post.id,
          tagId: TAG_NO_TAG
        })
      }
    },
    async [ACTION_SET_POST_FILE_INFO] ({
      commit,
      dispatch
    }, postFileInfos: PostFileInfo[]) {
      commit('clearPost')
      for (const post of postFileInfos) {
        dispatch('addPost', post)
      }
    }
  },
  getters: {
    getPostById: (state) => {
      return (id: string): StatePostFileInfo | undefined => {
        return _.find(state.fileInfos, ['id', id])
      }
    },
    getPostsByIds: (state) => {
      return (ids: string[]): StatePostFileInfo[] => {
        return _.filter(
          state.fileInfos,
          _.flow(
            _.property('id'),
            _.partial(_.includes, ids)
          )
        )
      }
    },
    getChangedFileInfos (state): StatePostFileInfo[] {
      return state.fileInfos.filter((info) => info.changed)
    }
  }
}

export default postsModule
