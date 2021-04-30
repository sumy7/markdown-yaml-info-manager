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

/**
 * 更新当前分类及其子分类的路径描述
 * @param category 分类
 * @param parentPath 父分类的路径
 */
function updateAllSubCategoriesPath (category: CategoryState, parentPath: string[]) {
  const currentPath = [...parentPath, category.name]
  category.path = currentPath
  for (const subCategory of category.children) {
    updateAllSubCategoriesPath(subCategory, currentPath)
  }
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
    },
    setCategoryNameById: function (state, payload) {
      const data: CategoryState | undefined = _.find(state.categories, {
        id: payload.categoryId
      })
      if (data) {
        const level = data.path.length
        data.name = payload.name
        // 遍历出所有子分类，修改路径中的path名称
        const allSubCategory: CategoryState[] = []
        allSubCategory.push(data)
        let i = 0
        while (i < allSubCategory.length) {
          if (allSubCategory[i].children.length > 0) {
            allSubCategory.push(...allSubCategory[i].children)
          }
          allSubCategory[i].path[level - 1] = payload.name
          i++
        }
      }
    },
    moveCategory: function (state, payload) {
      const fromCategory: CategoryState | undefined = _.find(state.categories, {
        id: payload.from
      })
      const toCategory: CategoryState | undefined | null = !payload.to ? null : _.find(state.categories, {
        id: payload.to
      })
      if (!fromCategory) {
        return
      }

      // 重新更新变化分类的路径描述
      if (fromCategory.parentId) {
        const fromParentCategory: CategoryState | undefined = _.find(state.categories, {
          id: fromCategory.parentId
        })
        if (fromParentCategory) {
          fromParentCategory.children = _.filter(fromParentCategory.children, function (o) {
            return o !== fromCategory
          })
        }
      }
      let parentPath: string[]
      if (!toCategory) { // 将分类移动到顶层
        fromCategory.parentId = null
        parentPath = []
      } else { // 将分类移动到目标
        fromCategory.parentId = toCategory.id
        parentPath = [...toCategory.path]
        toCategory.children.push(fromCategory)
      }
      updateAllSubCategoriesPath(fromCategory, parentPath)
    }
  },
  actions: {
    setCategoryNameById: function ({
      commit,
      getters
    }, payload) {
      commit('setCategoryNameById', payload)
      const subCategories: CategoryState[] = getters.getAllSubCategoriesByCategoryId(payload.categoryId)
      const postIds = _(subCategories)
        .map((o) => getters.getPostCategoryRelByCategoryId(o.id))
        .flatMap()
        .map('postId')
        .value()
      commit('setChangedFlagByPostIds', {
        postIds: postIds,
        changed: true
      })
    },
    moveCategory: function ({
      state,
      commit,
      getters
    }, payload) {
      // 校验是否进行了实质变更
      const fromCategory: CategoryState | undefined = _.find(state.categories, {
        id: payload.from
      })
      const toCategory: CategoryState | undefined | null = !payload.to ? null : _.find(state.categories, {
        id: payload.to
      })
      if (!fromCategory) {
        return
      }
      if ((!toCategory && fromCategory.parentId === null) || (toCategory && fromCategory.parentId === toCategory.id)) {
        return
      }

      commit('moveCategory', payload)
      const subCategories: CategoryState[] = getters.getAllSubCategoriesByCategoryId(payload.from)
      const postIds = _(subCategories)
        .map((o) => getters.getPostCategoryRelByCategoryId(o.id))
        .flatMap()
        .map('postId')
        .value()
      commit('setChangedFlagByPostIds', {
        postIds: postIds,
        changed: true
      })
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
    },
    getAllCategories: (state) => {
      return _.filter(state.categories, function (item: CategoryState) {
        return item.id !== NO_CATEGORY_ID
      })
    },
    getAllSubCategoriesByCategoryId: (state) => {
      return (categoryId: string): CategoryState[] => {
        const data: CategoryState | undefined = _.find(state.categories, {
          id: categoryId
        })
        if (!data) {
          return []
        }
        const allSubCategory: CategoryState[] = []
        allSubCategory.push(data)
        let i = 0
        while (i < allSubCategory.length) {
          if (allSubCategory[i].children.length > 0) {
            allSubCategory.push(...allSubCategory[i].children)
          }
          i++
        }
        return allSubCategory
      }
    }
  }
}
export default categoriesModule
