import * as types from '../mutation-types'

const state = {
  categories: {}
}

const mutations = {
  [types.CLEAR_CATEGORIES](state) {
    state.categories = {}
  },
  [types.ADD_CATEGORY](state, { article }) {
    for (let category of article.categories) {
      if (state.categories[category]) {
        state.categories[category].push(article.id)
      } else {
        state.categories[category] = [article.id]
      }
    }
  }
}

const actions = {

}

const getters = {
  categoriesList(state) {
    return state.categories
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
