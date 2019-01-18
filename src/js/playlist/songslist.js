{
    let view = {
        el:'section.songs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            console.log(data)
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
    let model = {
        playListId:'',
        songsList:[],
        fetch(id){
              // 假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
            var playlist = AV.Object.createWithoutData('Playlist', id)
            var query = new AV.Query('Song')
            query.equalTo('dependent', playlist)
            return query.find().then((songs) => {
                let data = {}
                songs.forEach( (song, i, a) => {
                    data.id = song.id
                    Object.assign(data,song.attributes)
                    this.songsList.push(data)
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
            this.model.playListId = this.getPlayListId()
            this.model.fetch(this.model.playListId).then(()=>{
                this.view.render(this.model.songsList)
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