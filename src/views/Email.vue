<template>
    <div class="component-container">
		<div class="content">
			<div class="panel-container">
				<div class="meta-header">
					<form @submit.prevent="compileEmail">
						<button type="submit" class="submit-styled">
							<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Publish email</p>
						</button>

						<div class="input-holder">
							<label for="">Name *</label>
							<input type="text" required v-model="email.Name" placeholder="Name">
						</div>
						<div class="input-holder">
							<label for="">Category</label>
							<input type="text" v-model="email.Category" placeholder="Template category">
						</div>
						<div class="input-holder">
							<label for="">Insert subsnippet</label>
							<Sort :payload="snippets" :sortBy="'Name'"
								@requestInsertSnippet="insertSnippet">
							</Sort>
						</div>
						<div class="input-holder">
							<label for="">Details</label>
							<textarea v-model="email.Details" rows="4" cols="30"></textarea>
						</div>
					</form>
				</div>
				<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
                    <template v-if="settings === 'split'">
                        <Section ref="left"
							:type="'half'"
							:sec_width="left_sec_width"
							:sec_height="sec_height"
							:value="email.Content"
							:lang="'html'"
							@onChangeListener="onChange"
							:insertString="insertString">
						</Section>
                        <div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
						<Section ref="left"
							:type="'render'"
							:iframeZindexValue="iframeZindexValue"
							:sec_width="right_sec_width"
							:sec_height="sec_height"
							:value="email._links['page-url'].href"
							style="display:flex">
						</Section>
                    </template>
                    <template v-if="settings === 'tabs'">
                        <div class="tabs_container">
							<div class="editor_tabs">
								<div class="editor_tabs_item" :class="{active: activeTab == i}" @click="toggletab(i)" v-for="(item, i) in page_tabs" :key="i"><p>{{item.type}}</p></div>
							</div>
							<div class="editor_tabs_content">
								<div class="section-full" v-if="activeTab == 0">
									<Section ref="left"
									:type="'full'"
									:sec_width="full_width"
									:sec_height="full_height"
									:value="email.Content"
									:lang="'html'"
									@onChangeListener="onChange"
									:insertString="insertString"></Section>
								</div>
								<div class="section-full " v-else-if="activeTab == 1">
									<Section ref="left" :type="'render'" :sec_width="full_width" :sec_height="full_height" :value="email._links['page-url'].href"></Section>
								</div>
							</div>
						</div>
                    </template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Sort from '../components/Sort'
import Section from '../components/Section'
export default {
	components: {
		Section,
		Sort
	},
	data () {
		return {
			// new
			left_sec_width: 0,
			right_sec_width: 0,
			iframeZindexValue: 0,
			// sec_width: 0,
			sec_height: 0,
			full_width: 0,
			full_height: 0,
			selectedSnippet: '',
			insertString: '',
			mousemove: false,
			activeTab: false,
			page_tabs: [
				{
					type: 'PageEditor',
					editor: 'page'
				},
				{
					type: 'Render',
					editor: 'page_render'
				}
			]
		}
	},
	methods: {
		insertSnippet (val) {
			return this.insertString = val.Placeholder
		},
		onChange (val) {
			this.email.Content = val
			this.selectedSnippet = ''
		},
		addSubSnippet (val) {
			console.log(this.selectedSnippet)
			return this.selectedSnippet
		},
		compileEmail () {
			this.$store.dispatch('saveEmail', this.email)
		},
		toggletab (i) {
			this.activeTab = i
		},
		handle (e) {
			this.gutter = e.target
			if (e.target === this.gutter) {
				this.mousemove = true
				this.iframeZindexValue = '-1'
			}
		},
		resizeSiblings (e) {
			let cursposPos = e.clientX - 239
			this.left_sec_width = Math.ceil(Math.max(140, (cursposPos - 1)))
			this.right_sec_width = (((window.innerWidth - 1) - 239) - this.left_sec_width)
			this.left_sec_width;
		},
		watchhandle (e) {
			if (this.mousemove === false) {
				return false
			}
			this.resizeSiblings(e)
		},
		stophandle () {
			this.mousemove = false
			this.iframeZindexValue = '0'
		}
	},
	mounted () {
		const mainWidth = window.innerWidth - 240
		const mainHeight = window.innerHeight - 56
		this.left_sec_width = Math.ceil(mainWidth / 2)
		this.right_sec_width = Math.ceil(mainWidth / 2)
		this.sec_height = (mainHeight)
		this.full_width = mainWidth - 1
		this.full_height = mainHeight - 47
	},
	computed: {
		settings () {
			return this.$store.getters.getMode
		},
		email () {
			return this.$store.getters.getEmail
		},
		snippets () {
			return this.$store.getters.getSnippets
		},
        widgets () {
			return this.$store.getters.getWidgets
		}
	},
	beforeMount () {
		let emailid = this.$route.params.id
		if (emailid.length > 0) {
			this.$store.dispatch('loadEmail', this.$route.params.id)
			this.$store.dispatch('fetchSnippets')
		}
	}
}
</script>
<style lang="scss">

</style>
