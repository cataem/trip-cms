<template>
	<div class="component-container">
		<div class="heading">
			<p>Translations by page</p>
			<form>
				<input type="text" class="search-input" v-model="filterQuery" placeholder="Search Page Name">
				<input type="submit" hidden>
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
							<button class="btn btn-icon" @click="sortby('Id')" :title="sortBy === 'Id' ? desc?'Sorted ascending by Id':'Sorted descending by Id' : 'Sort by Id'">
								Id
								<font-awesome-icon
								v-if="sortBy === 'Id'"
								:icon="['fas', !desc ? 'sort-down' : 'sort-up']"></font-awesome-icon>
							</button>
						</th>
						<th>
							<button class="btn btn-icon" @click="sortby('Name')" :title="sortBy === 'Name' ? desc?'Sorted ascending by Name':'Sorted descending by Name' : 'Sort by Name'">
								Name
								<font-awesome-icon
								v-if="sortBy === 'Name'"
								:icon="['fas', !desc ? 'sort-down' : 'sort-up']"></font-awesome-icon>
							</button>
						</th>
						<!-- <th align="center"><p>Status</p></th> -->
						<th align="center"><p>Actions</p></th>
					</tr>
				</thead>
				<tr v-for="(item, i) in pages"
				:key="i"
				class="list-item">
					<td class="list-item-id"><p>{{item.Id}}</p></td>
					<td class="list-item-grow">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'page-translation', params: { id: item.Id }}">
							{{item.Name}}
						</router-link>
					</td>
					<td class="list-item-action">
						<button class="btn btn-icon" @click.prevent="scanPage(item)" :title="'Scan ' +item.Name+ ' page for translation keys'">
							<font-awesome-icon :icon="['fas', 'binoculars']"></font-awesome-icon>
						</button>
						<router-link tag="button" class="btn btn-icon" :to="{name: 'page-translation', params: { id: item.Id }}" title="Translations">
							<font-awesome-icon :icon="['fas', 'sign-language']" style="font-size:105%"></font-awesome-icon>
						</router-link>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
export default {
	components: {},
	data () {
		return {
			filterQuery: '',
			sortBy: '',
			desc: false
		}
	},
	methods: {
		scanAllPages () {
			this.$store.dispatch('scanAllPages')
		},
		scanPage (page) {
			this.$store.dispatch('scanPage', page.Name)
		},
		sortby (query) {
			if (this.sortBy === query) {
				this.desc = !this.desc
				if (!this.desc) {
					this.sortBy = ''
					this.desc = false
					return
				}
			}
			this.sortBy = query
		}
	},
	computed: {
		pages () {
			const pages = this.$store.getters.getPages.map((p) => { p.Id = parseInt(p.Id); return p })
			if (this.filterQuery) {
				return pages.filter((p) => {
					return p.Name.toLowerCase().includes(this.filterQuery)
				})
			}
			const sorter = this.sortBy
			const order = this.desc ? 0 : 1
			if (sorter) {
				pages.sort((b, a) => {
					if (order) {
						return a[sorter] < b[sorter] ? -1 : 1
					} else {
						return b[sorter] < a[sorter] ? -1 : 1
					}
				})
			}
			return pages
		}
	},
	created () {
		this.$store.dispatch('fetchPages')
		this.$store.dispatch('getLanguages')
	}
}
</script>
<style lang="scss">
</style>
