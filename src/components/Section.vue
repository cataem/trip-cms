<template>
    <div v-if="type === 'half'" class="section-h" :style="{width: sec_width + 'px', height: sec_height + 'px', }">
        <div class="section-heading">
            <span>{{lang}}</span>
        </div>
        <Editor
            :value="value"
            :lang="lang"
            :width="sec_width - 1"
            :height="sec_height - 1"
            :fontsize="13"
			:onInsert="insertString"
			:onChange="onChange">
        </Editor>
    </div>
    <div
		v-else-if="type === 'split'"
		class="section-h"
		@mousemove="watchhandle($event)"
		@mouseup="stophandle()"
		@mouseleave="stophandle()"
		:style="{width: sec_width + 'px', height: sec_height + 'px', }">
        <div
			class="section-v"
			ref="top"
			@keydown.ctrl.83="save($event, toplang)"
			:style="{width: sec_width + 'px', height: sec_height / 2 + 'px'}">
            <div class="section-heading">
                <span>{{toplang}}</span> <span class="section-heading-info"> {{toptitle}}</span>
            </div>
            <Editor
                :value="topval"
                :lang="toplang"
                :width="sec_width - 1"
                :height="top_height - 1"
				:onChange="onTopChange"
				:onInsert="insertString"
                :fontsize="13">
            </Editor>
        </div>
        <div @mousedown="handle($event)" class="gutter-v" ref="gutter"></div>
        <div
			class="section-v"
			ref="bottom"
			@keydown.ctrl.83="save($event, botlang)"
			:style="{width: sec_width + 'px', height: sec_height / 2 + 'px'}">
            <div @click="activebottom = !activebottom" class="section-heading">
                <span>{{botlang}}</span> <span class="section-heading-info"> {{bottitle}}</span>
            </div>

             <Editor
                :value="botval"
                :lang="botlang"
                :width="sec_width - 1"
                :height="bot_height - 1"
				:onChange="onBotChange"
                :fontsize="13">
            </Editor>
        </div>
    </div>
    <div
		v-else-if="type === 'full'"
		class="section-h"
		@keydown.ctrl.83="save($event, lang)"
		:style="{width: sec_width + 'px', height: sec_height + 'px', }">
        <div class="section-heading">
            <span>{{lang}}</span>
        </div>
        <Editor
            :value="value"
            :lang="lang"
            :width="sec_width - 1"
            :height="sec_height - 1"
            :fontsize="13"
			:onInsert="insertString"
			:onChange="onChange">
        </Editor>
    </div>
	<div
		v-else-if="type === 'render'"
		class="section-h"
		:style="{width: sec_width + 'px', height: sec_height + 'px' }">
		<div class="section-heading render-header">
			<a :href="value" target="_blank">{{value}}</a>
		</div>
		<div class="render-width render">
			<a :href="value" target="_blank">{{sec_width}} px</a>
		</div>
		<iframe
			id="previewPage"
			:style="{'z-index': iframeZindexValue}"
			:width="(sec_width - 1) + 'px'"
			:height="(sec_height - 1) + 'px'"
			resize="both"
			sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups"
			:src="value"
			frameborder="0"></iframe>
	</div>
</template>
<script>
import Editor from './Editor'
// import DropDown from './DropDown'
export default {
	components: {
		Editor
		// DropDown
	},
	props: [
		'value', 'lang', 'type', 'sec_width', 'sec_height', 'toplang', 'botlang',
		'insertString', 'topval', 'botval', 'toptitle', 'bottitle', 'iframeZindexValue'
	],
	data () {
		return {
			dataSource: '',
			activetop: true,
			activebottom: false,
			active: false,
			mousemove: false,
			top_width: 0,
			top_height: 0,
			bot_height: 0,
			bottom_width: 0,
			bottom_height: 0,
			full_width: 0,
			full_height: 0
		}
	},
	watch: {
		'value': function (val) {
		}
	},
	methods: {
		save (event, lang) {
			event.preventDefault()
			// console.log(event, lang)
			this.$emit('save', [event, lang])
		},
		emitDataSource (val) {
			this.dataSource = val
		},
		closemodal (e) {
			e.stopPropagation()
			this.active = false
		},
		onChange (val) {
			this.$emit('onChangeListener', val)
		},
		onTopChange (val) {
			this.$emit('onTopChangeListener', val)
		},
		onBotChange (val) {
			this.$emit('onBotChangeListener', val)
		},
		resizeSiblings (e) {
			let top = this.$refs.top
			let bottom = this.$refs.bottom
			let cursposPos = e.clientY - 56
			top.style.height = Math.max(140, (cursposPos - 1)) + 'px'
			top.style.maxHeight = ((window.innerHeight - 196) - 7) + 'px'
			bottom.style.height = (((window.innerHeight - 1) - 56) - top.offsetHeight) + 'px'

			this.top_width = top.offsetWidth - 1
			this.top_height = top.offsetHeight - 1
			this.bottom_width = bottom.offsetWidth - 1
			this.bottom_height = bottom.offsetHeight - 1
			this.bot_height = this.bottom_height - 1
		},
		handle (e) {
			this.gutter = e.target
			if (e.target === this.gutter) {
				this.mousemove = true
			}
		},
		watchhandle (e) {
			if (this.mousemove == false) {
				return false
			}
			this.resizeSiblings(e)
		},
		stophandle () {
			this.mousemove = false
		},
		insert (val) {
			return 'string to insert'
		}
	},
	mounted () {
	}
}
</script>
<style lang="scss">
.section-heading.loading {
	position: relative;
	&:before {
		content: "loading";
		display:block;
		position:absolute;
		top:0;
		right:0;
		color:yellow;
		margin-top: 10px;
    	margin-right: 10px;
	}
}
</style>
