import { Module } from 'vuex'
import { RootStateType } from '@/store/index'
import _ from 'lodash'
import { nanoid } from 'nanoid'

export interface CategoryState {
  id: string,
  name: string,
  path: string[],
  parentId: string | null,
  children: CategoryState[]
}

export interface CategoriesStateType {
  categories: CategoryState[],
  idToCategoryMap: Map<string, CategoryState>
}

export const NO_CATEGORY_ID = '-1'

const NO_CATEGORY: CategoryState = {
  id: NO_CATEGORY_ID,
  name: '未分类',
  path: [],
  parentId: null,
  children: []
}

const categoriesModule: Module<CategoriesStateType, RootStateType> = {
  state: {
    categories: [
      NO_CATEGORY
    ],
    idToCategoryMap: new Map<string, CategoryState>([[NO_CATEGORY.id, NO_CATEGORY]])
  },
  mutations: {
    addCategory: function (state, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }

      let parentObj: CategoryState | null = null
      for (const cat of payload) {
        let data: CategoryState | undefined = _.find(state.categories, {
          name: cat,
          parentId: parentObj ? parentObj.id : null
        })
        if (!data) {
          data = {
            id: nanoid(),
            name: cat,
            path: parentObj ? [...parentObj.path, cat] : [cat],
            parentId: parentObj ? parentObj.id : null,
            children: []
          }
          state.categories.push(data)
          state.idToCategoryMap.set(data.id, data)
          if (parentObj) {
            parentObj.children.push(data)
          }
        }
        parentObj = data
      }
    }
  },
  getters: {
    findCategoryById: (state) => {
      return (id: string): CategoryState | undefined => {
        return state.idToCategoryMap.get(id)
      }
    },
    findCategoryByNamePath: (state) => {
      return (catHierarchy: string | string[]): CategoryState | null => {
        if (!Array.isArray(catHierarchy)) {
          catHierarchy = [catHierarchy]
        }
        let parentObj: CategoryState | null = null
        for (const cat of catHierarchy) {
          const data: CategoryState | undefined = _.find(state.categories, {
            name: cat,
            parentId: parentObj ? parentObj.id : null
          })
          if (!data) {
            return null
          }
          parentObj = data
        }
        return parentObj
      }
    },
    getCategoriesHierarchy: (state) => {
      return _.filter(state.categories, function (item) {
        return item.id !== NO_CATEGORY.id && item.parentId === null
      })
    }
  }
}
export default categoriesModule
