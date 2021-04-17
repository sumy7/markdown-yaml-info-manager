import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import { StatePostFileInfo } from '@/store/posts'
import { TAG_NO_TAG, TagState } from '@/store/tags'

export interface PostTagRel {
  id: string,
  postId: string,
  tagId: string,
}

export interface PostTagStateType {
  postTag: PostTagRel[]
}

const postTagModule: Module<PostTagStateType, RootStateType> = {
  state: {
    postTag: []
  },
  mutations: {
    clearPost (state) {
      state.postTag = []
    },
    addPostTagRel (state, payload) {
      const exist = _.find(state.postTag, {
        postId: payload.postId,
        tagId: payload.tagId
      })
      if (!exist) {
        state.postTag.push({
          id: nanoid(),
          postId: payload.postId,
          tagId: payload.tagId
        })
      }
    }
  },
  getters: {
    getPostTagRelByPostId: (state) => {
      return (postId: string) => {
        return _.filter(state.postTag, ['postId', postId])
      }
    },
    getPostTagRelByTagId: (state) => {
      return (tagId: string) => {
        return _.filter(state.postTag, ['tagId', tagId])
      }
    },
    getPostsByTagId: (state, getters, rootState, rootGetters) => {
      return (tagId: string): StatePostFileInfo[] => {
        return _(state.postTag)
          .filter(['tagId', tagId])
          .map('postId')
          .map<StatePostFileInfo>(rootGetters.getPostById)
          .value()
      }
    },
    getTagsByPostId: (state, getters, rootState, rootGetters) => {
      return (postId: string): TagState[] => {
        return _(state.postTag)
          .filter(['postId', postId])
          .map('tagId')
          .filter((tagId) => tagId !== TAG_NO_TAG) // 去除【未标签】的标签
          .map<TagState>(rootGetters.findTagById)
          .value()
      }
    }
  }
}

export default postTagModule
