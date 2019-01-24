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
            this.$el.find("#searchResult").html('')
            let $title
            if(data.playListResult.length === 0 || data.playListResult.length === 0 || data.playListResult.length === 0){
                $title = $(`
                    <h3 class="title">暂无匹配结果</h3>
                `)
            }else{
                $title = $(`
                    <h3 class="title">最佳匹配</h3>
                `)
            }
            this.$el.find("#searchResult").append($title)
            for(let key in data){
                if(key === 'playListResult'){
                    data[key].map((playlist)=>{
                        let $playlist = this.getPlaylist(playlist)
                        this.$el.find('#searchResult').append($playlist)
                    })
                }else if(key === 'singerResult'){
                    data[key].map((singer)=>{
                        let $singer = this.getSinger(singer)
                        this.$el.find('#searchResult').append($singer)
                    })
                }else if(key === 'songResult'){
                    data[key].map((song)=>{
                        let $li = this.getLi(song)
                        this.$el.find('#searchResult').append($li)
                    })
                }
            }
        },
        getSinger(singer){
            return $(`
            <li class="singer-li">
                <img src="${singer.cover}"></img>
                <h3>歌手：${singer.name}</h3>
                <a class="playButton" href="./singer-detail.html?id=${singer.id}">
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-right"></use>
                    </svg>
                </a>
            </li>
            `)
        },
        getPlaylist(playlist){
            return $(`
            <li class="playlist-li">
                <img src="${playlist.cover}"></img>
                <h3>歌单：${playlist.name}</h3>
                <a class="playButton" href="./playlist-detail.html?id=${playlist.id}">
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-right"></use>
                    </svg>
                </a>
            </li>
            `)
        },
        getLi(song){
            return $(`
            <li>
                <h3>${song.name}</h3>
                <p>
                    <svg class="icon icon-sq">
                        <use xlink:href="#icon-sq"></use>
                    </svg>
                    ${song.singer}
                </p>
                <a class="playButton" href="./song.html?id=${song.id}">
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-play"></use>
                    </svg>
                </a>
            </li>
            `)
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
                        this.searchResult.songResult.push(obj)
                    })
                }))
                this.searchQuery('Playlist','playListResult',word,promise)
                this.searchQuery('Singer','singerResult',word,promise)
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
                        this.view.render(this.model.searchResult)
                    })
                }
            })
            this.view.$el.find('.icon-cancel').click((e)=>{
                this.view.emptyInput()
                this.view.$el.find("#search")[0].focus()
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