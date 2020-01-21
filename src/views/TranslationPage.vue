<template>
	<div class="component-container">
		<div class="heading">
			<h4 style="padding:0 15px">Translations on page: <strong>{{page.Name}}</strong></h4>
			<button
				type="button"
				@click.prevent="scanPage"
				class="btn btn-green">
				<font-awesome-icon :icon="['fas', 'binoculars']"></font-awesome-icon> Scan Page
			</button>
			<form @submit.prevent="addExtKey(newExtKeyQuery)">
				<input type="text" class="search-input" v-model="newExtKeyQuery" placeholder="Add External Key">
				<input type="submit" class="btn btn-green" value="Add">&nbsp;
				<a href
					@click.prevent="scrollToExtKeys"
					v-if="extKeys.length && !isInViewport('ExternalKeysRow')"
					style="text-decoration:none;"><font-awesome-icon
						:icon="['fas', 'angle-double-down']" style="color:#ccc"></font-awesome-icon></a>&nbsp;&nbsp;
			</form>
			<a href @click.prevent="importingKeys = true" v-if="!importingKeys"><small>import external keys</small></a>
			<form v-if="importingKeys" @submit.prevent="importExternalKeys(keyImportPage)" style="margin-top:-16px;font-size:86.5%;">
				<label for="keyImportPage" style="color:#ddd;"><small>Import external keys from page</small></label><br>
				<select
					id="keyImportPage"
					ref="keyImportPage"
					v-model="keyImportPage"
					style="width: 100px; border-radius: 3px; height: 22px;">
					<option value="">select page</option>
					<option
						:key="p.Id"
						v-for="p in pages"
						:value="p.Name">
						{{p.Name}}
					</option>
				</select>&nbsp;
				<button type="submit" class="btn btn-green">import</button>&nbsp;
				<button
					type="reset"
					@click.prevent="importingKeys = false"
					style="border: none; border-radius: 3px; padding: 3px; margin-top: 1px;">cancel</button>
			</form>
			<div style="display:flex;flex-grow:1;flex-direction: row-reverse;">
				<a href
					v-if="!isInViewport('SaveBtn')"
					@click.prevent="$refs.SaveBtn.scrollIntoView({ behavior: 'smooth' })"
					style="margin:0 15px">
					<font-awesome-icon
						:icon="['far', 'save']" style="color:#ccc"></font-awesome-icon> <small> go to save</small>
				</a>
			</div>
		</div>
		<div class="content" ref="content" style="height:calc(100% - 42px)">
			<table class="list" cellpadding="0" cellspacing="0" width="100%">
				<thead class="list-heading">
					<tr>
						<th width="50%">
							<p style="position:relative;">Translation keys
								<input
									type="text"
									class="search-input keys-filter pull-left"
									:class="{active: filterKeyQuery}"
									placeholder="filter key"
									v-model="filterKeyQuery">
								<font-awesome-icon
									v-if="filterKeyQuery"
									@click.prevent="filterKeyQuery = ''"
									:icon="['fas', 'times']"
									style="position: relative;top: 3px;right: 20px;cursor:pointer;padding: 3px 5px;"></font-awesome-icon>
							</p>
						</th>
						<th width="50%">
							<p>
								Translation in &nbsp;
								<select
									v-model="language"
									class="form-control"
									style="border:1px solid #555;padding:3px 5px;background-color:transparent;color:#ccc;">
									<option
										:key="lang.Id"
										v-for="lang in languages"
										:value="lang.Code">{{lang.Name}}</option>
								</select>
								<span style="display:block;float:right;margin:0 15px;">
									<a href
										v-if="!importing"
										@click.prevent="importing = true"
										type="button">import translations</a>
									<form
										v-if="importing"
										@submit.prevent="importTranslations(importingPage)">
										<select
											ref="importingPage"
											v-model="importingPage"
											@change="$refs.importingPage.classList.remove('error')"
											style="width:100px;border-radius:3px;height:22px;">
											<option value="">select page</option>
											<option
												:key="p.Id"
												v-for="p in pages"
												:value="p.Name">
												{{p.Name}}
											</option>
										</select> &nbsp;
										<button type="submit" class="btn btn-green">import</button>&nbsp;
										<button
											type="reset"
											@click.prevent="importing = false;importingPage = '';"
											style="border:none;border-radius:3px;padding:3px;margin-top:1px;">cancel</button>
									</form>
								</span>
							</p>
						</th>
					</tr>
				</thead>
				<tr v-if="keys.length" class="tr-sep">
					<td colspan="2" align="center" style="font-size:18px;"><strong>Template Keys</strong></td>
				</tr>
				<tr v-for="(item, i) in keys"
				:key="'tr' + i"
				class="list-item">
					<td class="list-item-grow" @click.prevent="goToTranslation('tr', i)">
						<p style="font-size:15px;">{{item}}</p>
					</td>
					<td class="list-item-grow list-item-action1 translation">
						<label class="col-xs-12">
							<input
								type="text"
								:ref="`tr`+i"
								v-model="loctranslations[i]"
								class="translation-inp"
								style="width:calc(100% - 10px);padding-left:5px;padding-right:5px;font-size:15px;">
						</label>
					</td>
				</tr>
				<tr v-if="extKeys.length" class="tr-sep" style="">
					<td colspan="2" align="center" style="font-size:18px;">
						<!-- background-color:#262C34; -->
						<strong ref="ExternalKeysRow">External Keys</strong>
					</td>
				</tr>
				<tr v-for="(item, i) in extKeys"
				:key="'etr' + i"
				class="list-item list-extkeys">
					<td class="list-item-grow" @click.prevent="goToTranslation('etr', i)">
						<p style="font-size:15px;">
							{{item}} <font-awesome-icon
								@click="removeExtKey(i)"
								:icon="['fas', 'times']"></font-awesome-icon>
						</p>
					</td>
					<td class="list-item-grow list-item-action1 translation">
						<label class="col-xs-12">
							<input
								type="text"
								:ref="`etr`+i"
								v-model="locexttranslations[i]"
								class="translation-inp"
								style="width:calc(100% - 10px);padding-left:5px;padding-right:5px;font-size:15px;">
						</label>
					</td>
				</tr>
				<tr v-if="!keys.length && !extKeys.length" class="tr-sep">
					<td colspan="2" align="center" style="font-size:18px;"><strong><span>No Keys</span> <span v-if="filterKeyQuery"> With Current Filter</span></strong></td>
				</tr>
				<tr v-if="!filterKeyQuery" class="tr-sep" style="background:#19191f">
					<td align="left">
						<p>Total keys for translation: {{ totalKeys }}</p>
					</td>
					<td align="right" style="padding-right:15px;">
						<p>Translated: {{ translatedPercentage }}%</p>
					</td>
				</tr>
				<tr>
					<td colspan="2" align="center" cellpadding="0" style="padding:0">
						<button
							type="button"
							ref="SaveBtn"
							@click.prevent="save"
							class="btn btn-green col-xs-12 save-btn">SAVE</button>
					</td>
				</tr>
			</table>
			<transition name="fade" mode="out-in">
				<div v-if="activeModal" @click.self="closemodal($event)" class="full-screen-wrapper">
					<Modal @modalResponse="modalResponse" :note="note" :message="message"></Modal>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
import Modal from '../components/Modal.vue'
// fn that formats translation keys (space -> underscore)
const formatTranslationKeys = (key) => {
	return key.split(' ').join('_')
}
export default {
	components: {
		Modal
	},
	data () {
		return {
			filterKeyQuery: '',
			newExtKeyQuery: '',
			language: '',
			importing: false,
			importingPage: '',
			loctranslations: [],
			locexttranslations: [],
			locExtKeys: [],
			importingKeys: false,
			keyImportPage: '',
			activeModal: false,
			message: '',
			note: ''
		}
	},
	methods: {
		goToTranslation (str, i) {
			this.$refs[`${str}${i}`][0].focus()
		},
		addExtKey (k) {
			// if no ext keys yet
			if (!this.extKeys.length) {
				this.$set(this.extKeys, 0, k)
				this.exttranslations.push('')
				this.newExtKeyQuery = ''
				this.locExtKeys = this.extKeys
				setTimeout(() => {
					this.goToTranslation('etr', this.extKeys.length - 1)
				}, 100)
				return
			}
			// if key already added
			if (this.extKeys.includes(k)) {
				// console.error('Key already exists')
				this.$store.commit('Toast/_addError', 'Key already exists')
				this.filterKeyQuery = k
				this.newExtKeyQuery = ''
				return
			}
			// add new key and empty translation, then clear adding-key input and focus on translation input
			this.extKeys.push(k)
			this.exttranslations.push('')
			this.newExtKeyQuery = ''
			setTimeout(() => {
				this.goToTranslation('etr', this.extKeys.length - 1)
			}, 100)
		},
		removeExtKey (i) {
			const item = this.extKeys[i]
			this.activeModal = true
			this.note = i
			this.message = `Delete ${item} key?`
			// const confirmation = window.confirm(`Delete ${item} key?`)
			// if (confirmation) {
			// 	this.extKeys.splice(i, 1)
			// 	this.locexttranslations.splice(i, 1)
			// 	// this.saveExternalKeys()
			// }
		},
		modalResponse (value) {
			if (value.resp) {
				this.extKeys.splice(this.note, 1)
				this.locexttranslations.splice(this.note, 1)
				this.activeModal = false
				// this.saveExternalKeys()
			} else {
				this.activeModal = false
				this.note = ''
			}
		},
		saveTranslations () {
			const obj = {
				page: this.page.Name,
				lang: this.language,
				data: {}
			}
			this.keys.forEach((k, i) => {
				obj.data[k] = this.loctranslations[i] ? this.loctranslations[i] : ''
			})
			this.extKeys.forEach((k, i) => {
				obj.data[k] = this.locexttranslations[i] ? this.locexttranslations[i] : ''
			})
			this.$store.dispatch('saveTranslations', obj)
		},
		saveExternalKeys () {
			const obj = {
				page: this.page.Name,
				Keys: []
			}
			obj.Keys = obj.Keys.concat(this.extKeys)
			this.$store.dispatch('saveExternalKeys', obj)
		},
		save () {
			this.saveTranslations()
			if (this.extKeys.length) {
				this.saveExternalKeys()
			}
		},
		async scanPage () {
			// scan page
			await this.$store.dispatch('scanPage', this.page.Name)
			setTimeout(async () => {
				// refresh keys
				await this.$store.dispatch('getTranslationKeys', this.page.Name)
			}, 1000)
		},
		async importTranslations (page) {
			if (!page) {
				this.$refs['importingPage'].classList.add('error')
				return
			}
			await this.$store.dispatch('getTranslations', { page: page, lang: this.language })
			for (let k of Object.keys(this.translationsPerPage[page])) {
				if (this.keys.includes(k)) {
					const idx = this.keys.indexOf(k)
					if (this.translationsPerPage[page][k] && !this.translations[idx]) {
						this.translations[idx] = this.translationsPerPage[page][k]
					}
				}
				if (this.extKeys.includes(k)) {
					const idx = this.extKeys.indexOf(k)
					if (this.translationsPerPage[page][k] && !this.exttranslations[idx]) {
						this.exttranslations[idx] = this.translationsPerPage[page][k]
					}
				}
			}
			this.loctranslations = await this.translations
			this.locexttranslations = await this.exttranslations
			this.importingPage = ''
			this.importing = false
		},
		scrollToExtKeys () {
			this.$refs.ExternalKeysRow.scrollIntoView({ behavior: 'smooth' })
		},
		isInViewport (elem) {
			if (!this.$refs[elem]) {
				return false
			}
			var bounding = this.$refs[elem].getBoundingClientRect()
			return (
				bounding.top >= 0 &&
				bounding.left >= 0 &&
				bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
			)
		},
		async importExternalKeys () {
			if (!this.keyImportPage) {
				this.$refs.keyImportPage.classList.add('error')
				return
			}
			await this.$store.dispatch('importExternalKeys', { page: this.keyImportPage })
				.then((res) => {
					this.locexttranslations = []
					this.keyImportPage = ''
					this.importingKeys = false
				})
		}
	},
	computed: {
		page () {
			return this.$store.getters.getPage
		},
		pages () {
			return this.$store.getters.getPages
		},
		languages () {
			return this.$store.getters.getLanguages
		},
		translations () {
			const trs = this.$store.getters.getTranslations
			const result = []
			for (let k in this.keys) {
				result.push(trs[ formatTranslationKeys(this.keys[k]) ])
			}
			return result
		},
		exttranslations () {
			const trs = this.$store.getters.getExtTranslations
			const result = []
			for (let k in this.extKeys) {
				result.push(trs[ formatTranslationKeys(this.extKeys[k]) ])
			}
			return result
		},
		translationsPerPage () {
			return this.$store.getters.getTranslationsPerPage
		},
		keys () {
			if (this.filterKeyQuery) {
				return this.$store.getters.getTranslationKeys.filter((k) => {
					return k.toLowerCase().includes(this.filterKeyQuery.toLowerCase())
				})
			}
			return this.$store.getters.getTranslationKeys.length ? this.$store.getters.getTranslationKeys : []
		},
		extKeys () {
			if (this.filterKeyQuery && this.$store.getters.getExternalTranslationKeys.length) {
				return this.$store.getters.getExternalTranslationKeys.filter((k) => {
					return k.toLowerCase().includes(this.filterKeyQuery.toLowerCase())
				})
			}
			const defaultExtKeys = this.locExtKeys || []
			return this.$store.getters.getExternalTranslationKeys.length ? this.$store.getters.getExternalTranslationKeys : defaultExtKeys
		},
		totalKeys () {
			const nr1 = parseInt(this.keys.length + this.extKeys.length)
			const nr2 = parseInt(this.loctranslations.length + this.locexttranslations.length)
			const nr = nr1 !== nr2 ? Math.max(nr1, nr2) : nr1
			return isNaN(nr) ? 0 : nr
		},
		translatedPercentage () {
			const translatedCount = this.loctranslations ? this.loctranslations.filter((t) => {
				return t !== undefined && t.length > 0
			}).length : 0
			const extTranslatedCount = this.locexttranslations ? this.locexttranslations.filter((t) => {
				return t !== undefined && t.length > 0
			}).length : 0
			if (this.totalKeys === 0) {
				return 0
			}
			const nr = Math.round((translatedCount + extTranslatedCount) * 100 / this.totalKeys)
			if (!isFinite(nr)) {
				return 0
			}
			return isNaN(nr) ? 0 : nr
		}
	},
	beforeCreate () {
	},
	created () {
		this.keyImportPage = ''
	},
	async beforeMount () {
		this.$store.dispatch('loadPage', this.$route.params.id)
		await this.$store.dispatch('getLanguages')
		this.language = this.languages[0].Code
		await this.$store.dispatch('getTranslationKeys', this.page.Name)
		await this.$store.dispatch('getExternalTranslationKeys', this.page.Name)
		await this.$store.dispatch('getTranslations', { page: this.page.Name, lang: this.language })
		this.loctranslations = await this.translations
		this.locexttranslations = await this.exttranslations
	}
}
</script>
<style lang="scss" scoped>
table td.translation {
	padding:0;
}
.translation-inp {
	border:none;
	background-color:transparent;
	color:#ccc;
	height:38px;
	width:100%;
}
.tr-sep {
	background-image:repeating-linear-gradient(45deg, #303030, #303030 10px, #272727 10px, #272727 20px);
	td {
		color:#ccc;
		font-size:13px;
		text-transform: uppercase;
		border-top:1px solid #333;
		padding-top:5px;
		padding-bottom:5px;
	}
}
.save-btn {
	width: 30%;
    margin: 20px 0;
    font-size: 15px;
    font-weight: 600;
    padding: 6px 0;
    height: 30px;
}
.list-extkeys {
	p {
		position:relative;
		svg {
			position:absolute;
			top:0;
			right:5px;
			margin-top:-15px;
			padding:5px;
			color:lighten(red, 25%);
			cursor:pointer;
			&:hover {
				color:red;
			}
		}
	}
}
input.error, select.error, textarea.error {
	border-color:red;
}
.keys-filter {
	padding: 3px 6px;
	&.active {
		background-color: #b49b48;
		color: #fff;
	}
}
</style>
