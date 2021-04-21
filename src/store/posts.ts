import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import { PostFileInfo } from '@/utils/posts'
import { ACTION_SET_POST_FILE_INFO, MUTATION_SET_POST_FILE_INFOS } from '@/store/events'
import { nanoid } from 'nanoid'
import _ from 'lodash'
import { TAG_NO_TAG, TagState } from '@/store/tags'
import { CategoryState, NO_CATEGORY_ID } from '@/store/categories'

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
    setChangedFlagByPostIds (state, payload) {
      _(state.fileInfos)
        .filter((o: StatePostFileInfo) => _.includes(payload.postIds, o.id))
        .forEach((o) => {
          o.changed = true
        })
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

      if (postFileInfo.categories) {
        const hasHierarchy = _.filter(postFileInfo.categories, Array.isArray).length > 0
        for (const cats of hasHierarchy ? postFileInfo.categories : [postFileInfo.categories]) {
          let category = rootGetters.findCategoryByNamePath(cats)
          if (!category) {
            commit('addCategory', cats)
            category = rootGetters.findCategoryByNamePath(cats)
          }
          commit('addPostCategoryRel', {
            postId: post.id,
            categoryId: category.id
          })
        }
      } else {
        commit('addPostCategoryRel', {
          postId: post.id,
          categoryId: NO_CATEGORY_ID
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
    getPostCount: (state) => {
      return state.fileInfos.length
    },
    getChangedPostCount: (state, getters) => {
      return getters.getChangedFileInfos.length
    },
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
      return _.filter(state.fileInfos, { changed: true })
    },
    getPostFileInfosByPostIds (state, getters, rootState, rootGetters) {
      return (ids: string[]): PostFileInfo[] => {
        return _(state.fileInfos)
          .filter((o: StatePostFileInfo) => _.includes(ids, o.id))
          .map((o: StatePostFileInfo) => {
            const newPost: PostFileInfo = _.cloneDeep(o.postInfo)

            const categories: CategoryState[] = rootGetters.getCategoriesByPostId(o.id)
            if (categories.length === 1) {
              newPost.categories = _.cloneDeep(categories[0].path)
            } else if (categories.length > 1) {
              newPost.categories = _.map(categories, 'path')
            } else {
              newPost.categories = undefined
            }

            const tags: TagState[] = rootGetters.getTagsByPostId(o.id)
            if (tags.length > 0) {
              newPost.tags = _.map(tags, 'name')
            } else {
              newPost.tags = undefined
            }
            return newPost
          })
          .value()
      }
    }
  }
}

export default postsModule
