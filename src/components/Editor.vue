<template>
	<div ref="editor" class="editor" :style="{width: width + 'px', height: `${height}px`,}">
	</div>
</template>
<script>
import ace from 'brace'
export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		lang: {
			type: String,
			default: 'twig'
		},
		fontsize: {
			type: Number,
			default: 13
		},
		width: {
			type: Number,
			default: 500
		},
		height: {
			type: Number,
			default: 500
		},
		onChange: {
			type: Function
		},
		onInsert: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			editor: null,
			cursor: 1
		}
	},
	watch: {
		'valueToText': function (val, oldVal) {
			this.editor.setValue(val, 1)
		},
		'value': function (newVal, oldVal) {
			if (this.editor && this.editor.getValue() !== newVal) {
			// editor.setValue is a synchronous function call, change event is emitted before setValue return.
				this.silent = true
				const pos = this.editor.session.selection.toJSON()
				this.editor.setValue(newVal, pos.cursorStart)
				this.editor.session.selection.fromJSON(pos)
				this.silent = false
			}
			/* this.editor.setValue(val, 1);
			console.log(val); */
		},
		'width': function (newval, oldval) {
			this.editor.resize()
		},
		'height': function (newval, oldval) {
			this.editor.resize()
		},
		'onInsert': function (val, oldVal) {
			this.onInsertListener(val)
		},
		'lang': function (n, o) {
			if (n !== 0) {
				this.editor.getSession().setMode('ace/mode/' + n)
			}
		}
	},
	methods: {
		onChangeListener () {
			this.onChange(this.editor.getValue())
		},
		onInsertListener (val) {
			this.editor.insert(val)
		}
	},
	mounted () {
		// console.log(this.height)
		let editor

		/* if(this.lang === 'twig' || this.lang === 'html'){
			window.emmet = require('emmet')
			require('brace/ext/emmet')
		}  */
		require('brace/ext/beautify')
		require('brace/ext/searchbox')
		// require('brace/ext/themelist')
		require('brace/ext/language_tools')
		require('brace/ext/settings_menu')
		require('brace/mode/' + this.lang)
		require('brace/theme/solarized_dark')
		require('brace/theme/tomorrow_night')
		require('brace/snippets/' + this.lang)

		ace.acequire('ace/ext/beautify')
		ace.acequire('ace/ext/searchbox')
		/* var themelist = ace.acequire('ace/ext/themelist')
		console.log(themelist) */
		ace.acequire('ace/ext/language_tools')

		this.editor = editor = ace.edit(this.$el)

		// settings menu
		ace.acequire('ace/ext/settings_menu').init(editor)

		// editor.$blockScrolling = Infinity
		editor.getSession().setMode('ace/mode/' + this.lang)
		editor.setTheme('ace/theme/tomorrow_night')
		editor.getSession().setValue(this.value, 1)

		var defaultOptions = {
			// enable autocompletion and snippets
			enableBasicAutocompletion: true,
			enableSnippets: true,
			// fontSize: 14,
			enableLiveAutocompletion: false,
			// ,enableEmmet: true
			showGutter: true,
			wrap: 'free'
		}
		if (window.localStorage) {
			var userPreferences = window.localStorage.getItem('aceConfig')
			if (userPreferences) {
				try {
					userPreferences = JSON.parse(userPreferences)
					Object.assign(defaultOptions, userPreferences)
				} catch (err) {
					console.error('malformed editor configuration in local storage')
					window.localStorage.removeItem('aceConfig')
				}
			}
		}

		editor.setOptions(defaultOptions)
		editor.commands.addCommands([{
			name: 'showSettingsMenu',
			bindKey: { win: 'Ctrl-q', mac: 'Ctrl-q' },
			exec: function (editor) {
				editor.showSettingsMenu()
			},
			readOnly: true
		}])
		/* editor.commands.addCommand({
			name: 'save',
			bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
			exec: function(editor) {
				console.log("saving", editor.session.getValue())
			}
		}) */

		editor.session.on('change', this.onChangeListener)
		// this.$refs.editor.style.fontSize = this.fontsize + 'px'
		editor.resize()
	}
}
</script>
<style lang="scss">
.editor {
	width: 100%;
	height: calc(100% - 37px);
}
</style>
