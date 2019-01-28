{
    let view = {
        el:'section.songs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.find('.loading').remove()
            if(data.length === 0){
                let $span = $(`
                <span>此歌单暂未添加歌曲<span>
                `)
                this.$el.find('ol#songs').append($span)
            }else{
                data.map((song)=>{
                    let $li = $(`
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
                    this.$el.find('ol#songs').append($li)
                })
            }  
        }
    }
    let model = {
        playListId:'',
        songsIdList:[],
        songsList:[],
        getSongsId(id){
            let playlist = AV.Object.createWithoutData('Playlist', id)
            let query = new AV.Query('PlayListMap')
            query.equalTo('playlist', playlist)
            return query.find().then((songs) => {
                songs.forEach( (song, i, a) => {
                    let s = song.get('song')
                    this.songsIdList.push(s.id)
                })
                return songs
            })
        },
        fetch(Idlist){
            let promise = []
            Idlist.map((id)=>{
                let query = new AV.Query('Song')
                promise.push(query.get(id).then( (song) => {
                    let data = {}
                    data.id = song.id
                    Object.assign(data,song.attributes)
                    this.songsList.push(data)
                },  (error)=> {
                }))
            })
            return Promise.all(promise).then(()=>{
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.playListId = this.getPlayListId()
            this.model.getSongsId(this.model.playListId).then(()=>{
                this.model.fetch(this.model.songsIdList).then(()=>{
                    this.view.render(this.model.songsList)
                })
            })
        },
        getPlayListId(){
            let search = window.location.search

            search = search.substring(1)

            let arr = search.split('&').filter(v => v)

            let id = ''

            for(let i =0;i<arr.length;i++){
                let kv = arr[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                }
            }
            return id
        }
    }
    controller.init(view,model)
}