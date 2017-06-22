import * as types from '../mutation-types'

const state = {
  articles: []
}

const mutations = {
  [types.RECEIVE_ARTICLES](state, { articles }) {
    state.articles = articles
  },
  [types.CLEAR_ARTICLES](state) {
    state.articles = []
  },
  [types.ADD_ARTICLE](state, { article }) {
    state.articles.push(article)
  }
}

const actions = {
  replaceArticles({ commit }, articles) {
    commit(types.RECEIVE_ARTICLES, { articles })
  },
  clearArticles({ commit }) {
    commit(types.CLEAR_ARTICLES)
    commit(types.CLEAR_CATEGORIES)
    commit(types.CLEAR_TAGS)
  },
  addArticle({ commit }, article) {
    commit(types.ADD_ARTICLE, { article })
    commit(types.ADD_CATEGORY, { article })
    commit(types.ADD_TAG, { article })
  }
}

export default {
  state,
  mutations,
  actions
}
