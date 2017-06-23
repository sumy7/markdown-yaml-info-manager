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
  },
  [types.ADD_TAG_TO_ARTICLE](state, { articleId, tag }) {
    const article = state.articles.find((_article) => { return _article.id === articleId })
    if (article) {
      if (!article.tags.find((_tag) => { return _tag === tag })) {
        article.tags.push(tag)
      }
    }
  },
  [types.REMOVE_TAG_FROM_ARTICLE](state, { articleId, tag }) {
    const article = state.articles.find((_article) => { return _article.id === articleId })
    if (article) {
      article.tags.splice(article.tags.indexOf(tag), 1)
    }
  },
  [types.ADD_CATEGORY_TO_ARTICLE](state, { articleId, category }) {
    const article = state.articles.find((_article) => _article.id === articleId)
    if (article) {
      if (!article.categories.find((_category) => _category === category)) {
        article.categories.push(category)
      }
    }
  },
  [types.REMOVE_CATEGORY_FROM_ARTICLE](state, { articleId, category }) {
    const article = state.articles.find((_article) => _article.id === articleId)
    if (article) {
      article.categories.splice(article.categories.indexOf(category), 1)
    }
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
  },
  addTagToArticle({ commit }, { articleId, tag }) {
    commit(types.ADD_TAG_TO_ARTICLE, { articleId, tag })
    commit(types.ADD_ARTICLE_TO_TAG, { tag, articleId })
  },
  removeTagFromArticle({ commit }, { articleId, tag }) {
    commit(types.REMOVE_TAG_FROM_ARTICLE, { articleId, tag })
    commit(types.REMOVE_ARTICLE_FROM_TAG, { tag, articleId })
  },
  addCategoryToArticle({ commit }, { articleId, category }) {
    commit(types.ADD_CATEGORY_TO_ARTICLE, { articleId, category })
    commit(types.ADD_ARTICLE_TO_CATEGORY, { category, articleId })
  },
  removeCategoryFromArticle({ commit }, { articleId, category }) {
    commit(types.REMOVE_CATEGORY_FROM_ARTICLE, { articleId, category })
    commit(types.REMOVE_ARTICLE_FROM_CATEGORY, { category, articleId })
  }
}

export default {
  state,
  mutations,
  actions
}
