<template>
	<div class="component-container">
		<div class="heading">
			<p>Pages</p>
			<router-link tag="button" class="btn btn-green" :to="{ name: 'new', params: {type: 'page'}}">
				New Page
			</router-link>
			<form>
				<input type="text" class="search-input" v-model="filterQuery" placeholder="Search Page Name">
			</form>
			<div style="display:flex;flex-grow:1;flex-direction: row-reverse;">
				<button type="button" @click.prevent="scanAllPages" class="btn btn-green" title="Scan all pages for translation keys" style="margin:0 15px;">
					<font-awesome-icon :icon="['fas', 'binoculars']"></font-awesome-icon> Scan All Pages
				</button>
			</div>
		</div>
		<div class="content" ref="content" style="height:calc(100% - 42px)">
			<table class="list" cellpadding="0" cellspacing="0" width="100%">
				<thead class="list-heading">
					<tr>
						<th>
							<button class="btn btn-icon" @click="sortbyindex()">
								Id
								<!-- <font-awesome-icon
								:icon="['fas', activeindex ? 'sort-down' : 'sort-up']"></font-awesome-icon> -->
							</button>
						</th>
						<th>
							<button class="btn btn-icon" @click="sortbyname()">
								Name
								<!-- <font-awesome-icon
								:icon="['fas', activename ? 'sort-down' : 'sort-up']"></font-awesome-icon> -->
							</button>
						</th>
						<th align="center"><p>Status</p></th>
						<th align="center"><p>Actions</p></th>
					</tr>
				</thead>
				<tr v-for="(item, i) in pages"
				:key="i"
				class="list-item">
					<td class="list-item-id"><p>{{item.Id}}</p></td>
					<td class="list-item-grow">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'page', params: { id: item.Id }}">
							{{item.Name}}
						</router-link>
					</td>
					<td class="list-item-action">
						<div class="togglecheckbox">
							<span :class="['toggle-icon', item.Status == 1 ? 'checked' : '']" @click="toggleicon(item)"></span>
						</div>
					</td>
					<td class="list-item-action">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'page', params: { id: item.Id }}" title="edit">
							<font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
						</router-link>
						<router-link tag="button" class="btn btn-icon" :to="{name: 'page-translation', params: { id: item.Id }}" title="edit translations">
							<font-awesome-icon :icon="['fas', 'sign-language']" style="font-size:105%"></font-awesome-icon>
						</router-link>
						<!-- <button class="btn btn-icon" @click.prevent="scanPage(item)" title="scan page for translation keys">
							<font-awesome-icon :icon="['fas', 'binoculars']"></font-awesome-icon>
						</button> -->
						<button class="btn btn-icon" @click.prevent="askModalDeletePage(item)">
							<font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
						</button>
					</td>
				</tr>
				<tr v-if="!pages.length">
					<td colspan="4" class="" align="center" style="border-top:1px solid #333;padding-top:3em;padding-bottom:3em;">
						<p><strong><span>No pages</span> <span v-if="filterQuery"> for current filter "{{filterQuery}}"</span></strong></p>
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
export default {
	components: {
		Modal
	},
	data () {
		return {
			index: 0,
			active: false,
			// modal
			filterQuery: '',
			activeModal: false,
			message: '',
			note: '',
			activeindex: false,
			activename: false,
			pagei: 0,
			sorting: ['sort-down', 'sort-up']
		}
	},
	mounted () {
		// this.$refs.content.offsetWidth
	},
	methods: {
		scanAllPages () {
			this.$store.dispatch('scanAllPages')
		},
		scanPage (page) {
			this.$store.dispatch('scanPage', page.Name)
		},
		modalResponse (val) {
			if (val.resp === true) {
				this.$store.dispatch('deletePage', val.note)
				this.activeModal = false
			} else {
				this.activeModal = false
			}
		},
		closemodal (e) {
			e.stopPropagation()
			this.activeModal = false
		},
		askModalDeletePage (item) {
			this.message = 'Delete Page ' + item.Name + ' ?'
			this.note = item.Id
			this.activeModal = true
		},
		deletePage (id) {
			this.$store.dispatch('deletePage', id)
		},
		loadPage (id) {

		},
		sortbyindex () {
			this.activeindex = !this.activeindex
		},
		sortbyname () {
			this.activename = !this.activename
		},
		sort (index) {

		},
		toggle (value) {

		},
		toggleicon (val) {
			let newstatus
			if (val.Status === '1') {
				newstatus = '0'
			} else {
				newstatus = '1'
			}
			let payload = {
				Id: val.Id,
				Status: newstatus
			}
			this.$store.dispatch('togglePageStatus', payload)
			val.Status = newstatus
		}
	},
	computed: {
		pages () {
			const pages = this.$store.getters.getPages
			if (this.filterQuery) {
				return pages.filter((p) => {
					return p.Name.toLowerCase().includes(this.filterQuery.toLowerCase())
				})
			}
			return pages
		}

	},
	created () {
		this.$store.dispatch('fetchPages')
	}
}
</script>
<style lang="scss">
</style>
