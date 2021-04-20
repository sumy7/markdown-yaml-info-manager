import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import { randomColor } from '@/utils/commons'

export const TAG_NO_TAG = '-1'

export interface TagState {
  id: string
  name: string,
  appearance: {
    normal: string,
    hover: string
  }
}

export interface TagsStateType {
  tags: TagState[]
}

const tagsModule: Module<TagsStateType, RootStateType> = {
  state: {
    tags: [{
      id: TAG_NO_TAG,
      name: '未标签',
      appearance: {
        normal: 'bg-gray-400',
        hover: 'hover:bg-gray-500'
      }
    }]
  },
  mutations: {
    addTag (state, payload) {
      let tag: TagState | undefined = _.find(state.tags, ['name', payload.name])
      if (tag) {
        return
      }
      tag = {
        id: nanoid(),
        name: payload.name,
        appearance: randomColor()
      }
      state.tags.push(tag)
    }
  },
  getters: {
    findTagById: (state) => {
      return (id: string): TagState | undefined => {
        return _.find(state.tags, ['id', id])
      }
    },
    findTagByName: (state) => {
      return (name: string): TagState | undefined => {
        return _.find(state.tags, ['name', name])
      }
    },
    getAllTags: (state) => {
      return _.filter(state.tags, (tag) => tag.id !== TAG_NO_TAG)
    }
  }
}

export default tagsModule