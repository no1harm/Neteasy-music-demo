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

        },
        emptyInput(){
            this.$el.find('#search').val('')
        },
    }
    let model = {
        keyWords:[],
        searchResult:{
            singerResult:[],
            songResult:[],
            playListResult:[]
        },
        emptyResult(){
          for(let key in this.searchResult){
              this.searchResult[key] = []
          }  
        },
        search(keyWords){
            let promise = []
            keyWords.map((word)=>{
                let singer = new AV.Query('Song')
                singer.contains('singer', word)
                let name = new AV.Query('Song')
                name.contains('name', word)
                let query = AV.Query.or(name,singer)
                promise.push(query.find().then((songs)=>{
                    songs.map(song=>{
                        let obj = {}
                        obj.id = song.id
                        Object.assign(obj,song.attributes)
                        this.searchResult.singerResult.push(obj)
                    })
                }))
                this.searchQuery('Playlist','playListResult',word,promise)
            })
            return Promise.all(promise).then((data)=>{})
        },
        searchQuery(className,store,word,promise){
            let query = new AV.Query(className)
            query.contains('name',word)
            promise.push(query.find().then((lists)=>{
                lists.map(list=>{
                    let obj = {}
                    obj.id = list.id
                    Object.assign(obj,list.attributes)
                    this.searchResult[store].push(obj)
                })
            }))
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
                    this.view.emptyInput()
                    this.model.emptyResult()
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