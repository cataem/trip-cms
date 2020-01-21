const state = {
	keys: [],
	extkeys: [],
	translations: {},
	exttranslations: {},
	languages: [],
	translationsPerPage: {},
	importedExtKeys: []
}
// fn that formats translation keys (space -> underscore)
const formatTranslationKeys = (key) => {
	return key.split(' ').join('_')
}

const mutations = {
	'SET_KEYS' (state, data) {
		state.keys = data
	},
	'SET_EXT_KEYS' (state, data) {
		state.extkeys = data
	},
	'SET_TRANSLATIONS' (state, data) {
		const translations = {}
		const formattedKeys = state.keys.map((k) => {
			return formatTranslationKeys(k)
		})
		for (let k in data) {
			if (formattedKeys.includes(k)) {
				translations[k] = data[k] ? data[k] : ''
			}
		}
		state.translations = translations
	},
	'SET_EXT_TRANSLATIONS' (state, data) {
		const translations = {}
		if (!state.extkeys.length) {
			state.exttranslations = {}
			return
		}
		const formattedExtKeys = state.extkeys.map((k) => {
			return formatTranslationKeys(k)
		})
		for (let k of formattedExtKeys) {
			if (data.hasOwnProperty(k)) {
				translations[k] = data[k] !== 'undefined' ? data[k] : ''
			}
		}
		// for (let k in data) {
		// 	if (formattedExtKeys.includes(k)) {
		// 		translations[k] = data[k] ? data[k] : ''
		// 	}
		// }
		state.exttranslations = translations
	},
	'SET_LANGUAGES' (state, data) {
		state.languages = data._embedded.languages
		return state.languages
	},
	'SET_TRANSLATIONS_BY_PAGE' (state, data) {
		state.translationsPerPage[data.page] = data.data
	},
	'SET_IMPORTED_KEYS' (state, data) {
		state.importedExtKeys = data
	}
}

const actions = {
	scanAllPages ({ commit, dispatch }) {
		dispatch('callApi', {
			method: 'POST',
			ingoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/api.php/cms/translate/keys/generate`
		}).then((resp) => {
			commit('Toast/_add', 'Pages scanned')
		}).catch((err) => {
			console.log(err)
		})
	},
	scanPage ({ commit, dispatch }, page) {
		dispatch('callApi', {
			method: 'POST',
			ignoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/api.php/cms/translate/keys/generate/${page}`
		}).then((res) => {
			commit('Toast/_add', `Page ${page} scanned`)
		}).catch((err) => {
			console.error(err)
		})
	},
	async getLanguages ({ commit, dispatch }) {
		await dispatch('callApi', {
			method: 'GET',
			ignoreBaseUrl: true,
			url: `/languages`
		}).then((res) => {
			commit('SET_LANGUAGES', res.data)
		}).catch((err) => {
			console.log(err)
		})
	},
	async getTranslationKeys ({ commit, dispatch }, page) {
		if (!page) return
		await dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/published/data/cms-translate/${page}/translation_keys.json`
		}).then((resp) => {
			commit('SET_KEYS', resp.data)
		}).catch((err) => {
			console.log(err)
			commit('SET_KEYS', [])
		})
	},
	async getExternalTranslationKeys ({ commit, dispatch }, page) {
		if (!page) return
		await dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/published/data/cms-translate/${page}/external_keys.json`
		}).then((resp) => {
			commit('SET_EXT_KEYS', resp.data)
		}).catch((err) => {
			console.log(err)
			commit('SET_EXT_KEYS', [])
		})
	},
	async getTranslations ({ commit, dispatch }, { page, lang }) {
		return dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/published/data/cms-translate/${page}/dictionary/${lang}.json`
		}).then((resp) => {
			commit('SET_TRANSLATIONS', resp.data)
			commit('SET_EXT_TRANSLATIONS', resp.data)
			commit('SET_TRANSLATIONS_BY_PAGE', { page: page, data: resp.data })
		}).catch((err) => {
			console.log(err)
			commit('SET_TRANSLATIONS', {})
			commit('SET_EXT_TRANSLATIONS', {})
			commit('SET_TRANSLATIONS_BY_PAGE', { page: page, data: {} })
		})
	},
	saveTranslations ({ commit, dispatch }, { page, lang, data }) {
		dispatch('translateApi', {
			method: 'POST',
			ignoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/api.php/cms/translate/dictionary/${page}/${lang}`,
			data: data
		}).then((resp) => {
			commit('Toast/_add', 'Translations saved')
		}).catch((err) => {
			console.log(err)
			commit('Toast/_addError', 'Failed saving translations')
		})
	},
	saveExternalKeys ({ commit, dispatch }, { page, Keys }) {
		const keys = {}
		Keys.forEach((k, i) => {
			keys[`Keys[${i}]`] = k
		})
		dispatch('translateApi', {
			method: 'POST',
			ignoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/api.php/cms/translate/keys/external/${page}`,
			data: keys
		}).then((resp) => {
			// commit('Toast/_add', 'External Translation Keys added')
		}).catch((err) => {
			console.log(err)
		})
	},
	async importExternalKeys ({ commit, dispatch }, { page }) {
		if (!page) {
			commit('SET_IMPORTED_KEYS', [])
			return
		}
		return dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.PROJECT_BASE_URL + `/published/data/cms-translate/${page}/external_keys.json`
		}).then((resp) => {
			commit('SET_EXT_KEYS', resp.data)
		}).catch((err) => {
			console.log(err)
			commit('SET_EXT_KEYS', [])
		})
	}
}

const getters = {
	getLanguages: (state) => {
		return state.languages
	},
	getTranslationKeys: (state) => {
		return state.keys
	},
	getExternalTranslationKeys: (state) => {
		return state.extkeys
	},
	getTranslations: (state) => {
		return state.translations
	},
	getExtTranslations: (state) => {
		return state.exttranslations
	},
	getTranslationsPerPage: (state) => {
		return state.translationsPerPage
	},
	getImportedExtKeys: (state) => {
		return state.importedExtKeys
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
