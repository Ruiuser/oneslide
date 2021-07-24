const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

const isMain = str => (/^#{1,2}(?!#)/).test(str)//量词括号用{} 前瞻用()
const isSub = str => (/^#{3}(?!#)/).test(str)

const covert =raw => {
  let arr = raw.split(/\n(?=\s*#)/).filter(s => s!="").map(s => s.trim())
	//split根据条件分割字符串，返回成数组
	// filter过滤
	// map去除字符串头尾空白符
  let html = ""
  for(let i=0; i<arr.length; i++){

    if(arr[i+1] !== undefined){
      if(isMain(arr[i]) && isMain(arr[i+1])){
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
        `
      } else if(isMain(arr[i]) && isSub(arr[i+1])){
        html +=`
<section>
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
          `
      } else if(isSub(arr[i]) && isSub(arr[i+1])){
        html += `
<section data-markdown>        
<textarea data-template>
${arr[i]}
</textarea>
</section>
      `
      } else if(isSub(arr[i]) && isMain(arr[i+1])){
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
</section>
      `
      } 
    } 
    else{
      if(isMain(arr[i])){
        html +=`
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
      `
      } else if(isSub(arr[i])){
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
</section>
      `  
      }     
    }  
  }
  return html
}



const Menu = {
  init() {
    console.log('Menu init...')
    this.$settingIcon = $('.control .icon-setting')
    this.$menu = $('.menu')
    this.$closeIcon = $('.menu .icon-close')

    this.$$tabs = $$('.menu .tab')
    this.$$contents = $$('.menu .content')//为什么不是 .menu .detail .content 因为只有一种类型的.content，不用担心寻找错误，因此.detail可以不写
    

    this.bind()
  },

  bind() {
    this.$settingIcon.onclick = () => {
      // 下面的this指向的是this.$settingIcon，因此使用箭头函数，this会获取外部的this
      this.$menu.classList.add('open')
    }

    this.$closeIcon.onclick = () => {
      this.$menu.classList.remove('open')
    }

    this.$$tabs.forEach($tab => $tab.onclick = () => {
      this.$$tabs.forEach($node => $node.classList.remove('active'))
      $tab.classList.add('active')
      let index = [...this.$$tabs].indexOf($tab)
      this.$$contents.forEach($node => $node.classList.remove('active'))
      this.$$contents[index].classList.add('active')
    })
  }
}


  const Editor = {
    init() {
      console.log('Editor init...')
      this.$editInput = $('.editor textarea')
      this.$saveBtn = $('.editor .button-save')
      this.$slideContainer = $('.slides')
      this.markdown = localStorage.markdown || `# one slide`

      this.bind()
      this.start()
    },

    bind() {
      this.$saveBtn.onclick = () => {
        localStorage.markdown = this.$editInput.value
        location.reload()
      }
    },

    start() {
      this.$editInput.value = this.markdown
		  this.$slideContainer.innerHTML = covert(this.markdown)
		//设置或返回返回表格行的开始和结束标签之间的 HTML

			// Also available as an ES module, see:
			// https://revealjs.com/initialization/
			Reveal.initialize({
				controls: true,
				progress: true,
				center: true,
				hash: true,

				// Learn about plugins: https://revealjs.com/plugins/
				plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight ]
			});
    }

  }


const App = {
  init() {
    [...arguments].forEach(Module => Module.init())
  }
}

App.init(Menu,Editor)

