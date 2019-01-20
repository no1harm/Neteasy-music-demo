{
    let view = {
        el:".page-3",
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        },
        render(data){

        }
    }
    let model = {
        keyWords:[],
        searchResult:{
            singerResult:[],
            songResult:[],
            playListResult:[]
        },
        search(keyWords){
            let promise = []
            console.log(keyWords)
            keyWords.map((word)=>{
                let singer = new AV.Query('Song')
                singer.contains('singer', word)
                promise.push(singer.find().then((sings)=>{
                    sings.map(sing=>{
                        let obj = {}
                        obj.id = sing.id
                        Object.assign(obj,sing.attributes)
                        this.searchResult.singerResult.push(obj)
                    })
                }))
            })
            return Promise.all(promise).then((data)=>{})
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.find('#search').keypress((e)=>{
                if(e.keyCode === 13){
                    let string = e.currentTarget.value
                    this.model.keyWords = this.getKeyWords(string)
                    this.model.search(this.model.keyWords).then((data)=>{
                        console.log(this.model.searchResult)
                    })
                }
            })
        },
        bindEventsHub(){
            window.eventHub.on('selectedTab',(data)=>{
                if(data === 'page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        getKeyWords(string){
            let keyWords = []
            if(string.indexOf(" ") === -1){
                keyWords.push(string)
                return keyWords
            }else{
                keyWords.push(string)
                let temp = string.split(' ')
                let wordArr = keyWords.concat(temp)
                return wordArr
            }
        }
    }
    controller.init(view,model)
}