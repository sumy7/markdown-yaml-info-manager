import * as types from '../mutation-types'

const state = {
  tags: []
}

const mutations = {
  [types.CLEAR_TAGS](state) {
    state.tags = []
  },
  [types.ADD_TAG](state, { article }) {
    for (let tag of article.tags) {
      let tags = state.tags.find((_tag) => { return _tag.name === tag })
      if (!tags) {
        state.tags.push({ name: tag, list: [article.id] })
      } else {
        tags.list.push(article.id)
      }
    }
  },
  [types.ADD_ARTICLE_TO_TAG](state, { tag, articleId }) {
    let tags = state.tags.find((_tag) => { return _tag.name === tag })
    if (tags) {
      if (!tags.list.find((_id) => _id === articleId)) {
        tags.list.push(articleId)
      }
    } else {
      state.tags.push({ name: tag, list: [articleId] })
    }
  },
  [types.REMOVE_ARTICLE_FROM_TAG](state, { tag, articleId }) {
    let tags = state.tags.find((_tag) => { return _tag.name === tag })
    if (tags) {
      tags.list.splice(tags.list.indexOf(articleId), 1)
    }
  }
}

const actions = {

}

const getters = {
  tagsList(state) {
    return state.tags
  },
  getArticleByTagName(state, getters, rootState) {
    return (tag) => {
      let tags = state.tags.find((_tag) => { return _tag.name === tag })
      if (tags) {
        return tags.list.map((id) => {
          return rootState.Article.articles.find((article) => article.id === id)
        })
      }
      return null
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
