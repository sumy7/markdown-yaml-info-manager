import * as types from '../mutation-types'

const state = {
  categories: []
}

const mutations = {
  [types.CLEAR_CATEGORIES](state) {
    state.categories = []
  },
  [types.ADD_CATEGORY](state, { article }) {
    for (let category of article.categories) {
      let categories = state.categories.find((_categories) => _categories.name === category)
      if (!categories) {
        state.categories.push({ name: category, list: [article.id] })
      } else {
        categories.list.push(article.id)
      }
    }
  },
  [types.ADD_ARTICLE_TO_CATEGORY](state, { category, articleId }) {
    let categories = state.categories.find((_category) => _category.name === category)
    if (categories) {
      if (!categories.list.find((_id) => _id === articleId)) {
        categories.list.push(articleId)
      }
    } else {
      state.categories.push({ name: category, list: [articleId] })
    }
  },
  [types.REMOVE_ARTICLE_FROM_CATEGORY](state, { category, articleId }) {
    let categories = state.categories.find((_categories) => _categories.name === category)
    if (categories) {
      categories.list.splice(categories.list.indexOf(articleId), 1)
    }
  }
}

const actions = {

}

const getters = {
  categoriesList(state) {
    return state.categories
  },
  getArticleByCategoryName(state, getters, rootState) {
    return (category) => {
      let categories = state.categories.find((_category) => _category.name === category)
      if (categories) {
        return categories.list.map((_id) => rootState.Article.articles.find((_article) => _article.id === _id))
      } else {
        return []
      }
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
