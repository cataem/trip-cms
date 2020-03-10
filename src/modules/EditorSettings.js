const STORAGE_KEY = 'edset'
const editorSettings = localStorage.getItem(STORAGE_KEY)
const state = {
	mode: editorSettings ? JSON.parse(editorSettings).mode : 'split',
	// mode: 'tabs',
	settings: {
		wrap: false,
		line: true
	}
}

const mutations = {
	UPDATE_MODE (state, payload) {
		state.mode = payload
	},
	UPDATE_SETTINGS (state, payload) {
		state.settings = payload
	}
}

const actions = {
	updateMode ({ commit }, payload) {
		commit('UPDATE_MODE', payload)
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: payload }))
	},
	updateSettings ({ commit }, payload) {
		commit('UPDATE_SETTINGS', payload)
	}
}

const getters = {
	getMode: (state) => {
		return state.mode
	},
	getSettings: (state) => {
		return state.settings
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
