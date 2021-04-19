import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import { CategoryState, NO_CATEGORY_ID } from '@/store/categories'
import { StatePostFileInfo } from '@/store/posts'

export interface PostCategoryRel {
  id: string,
  postId: string,
  categoryId: string
}

export interface PostCategoryStateType {
  postCategory: PostCategoryRel[]
}

const postCategoryModule: Module<PostCategoryStateType, RootStateType> = {
  state: {
    postCategory: []
  },
  mutations: {
    clearPost (state) {
      state.postCategory = []
    },
    addPostCategoryRel (state, payload) {
      const exist = _.find(state.postCategory, {
        postId: payload.postId,
        categoryId: payload.categoryId
      })
      if (!exist) {
        state.postCategory.push({
          id: nanoid(),
          postId: payload.postId,
          categoryId: payload.categoryId
        })
      }
    }
  },
  getters: {
    getPostCategoryRelByCategoryId: (state) => {
      return (categoryId: string) => {
        return _.filter(state.postCategory, ['categoryId', categoryId])
      }
    },
    getPostsByCategoryId: (state, getters, rootState, rootGetters) => {
      return (categoryId: string): StatePostFileInfo[] => {
        return _(state.postCategory)
          .filter(['categoryId', categoryId])
          .map('postId')
          .map<StatePostFileInfo>(rootGetters.getPostById)
          .value()
      }
    },
    getCategoriesByPostId: (state, getters, rootState, rootGetters) => {
      return (postId: string): CategoryState[] => {
        return _(state.postCategory)
          .filter(['postId', postId])
          .map('categoryId')
          .filter((categoryId) => categoryId !== NO_CATEGORY_ID)
          .map<CategoryState>(rootGetters.findCategoryById)
          .value()
      }
    }
  }
}

export default postCategoryModule
