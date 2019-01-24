{
    let view = {
        el:'.tab-content .page-songs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            if(data.length !== 0){
                data.map((song)=>{
                    let $li = this.getLi(song)
                    this.$el.find('ol#songs').append($li)
                })
            }else{
                let $span = $(`<span>曲库尚未收录该歌手作品</span>`)
                this.$el.find('ol#songs').append($span)
            }
        },
        getLi(data){
            return $(`
            <li>
                <h3>${data.name}</h3>
                <p>
                    <svg class="icon icon-sq">
                        <use xlink:href="#icon-sq"></use>
                    </svg>
                    ${data.singer}
                </p>
                <a class="playButton" href="./song.html?id=${data.id}">
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-play"></use>
                    </svg>
                </a>
            </li>
            `)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {
        singerName:'',
        data:{
            songs:[]
        },
        fetch(name){
            let song = new AV.Query('Song')
            song.contains('singer', name)
            return song.find().then((songs)=>{
                songs.map((song)=>{
                    let data = {}
                    data.id = song.id
                    Object.assign(data,song.attributes)
                    this.data.songs.push(data)
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view 
            this.view.init()
            this.model = model
            this.bindEventsHub()
            this.model.singerName = decodeURIComponent(window.parseUrl.getName())
            this.model.fetch(this.model.singerName).then(()=>{
                this.view.render(this.model.data.songs)
            })
        },
        bindEventsHub(){
            window.eventHub.on('selectedSingerTab',(data)=>{
                if(data === 'page-songs'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}