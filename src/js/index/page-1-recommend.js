{
    let view = {
        el:'.playlists',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songList} = data
            this.$el.find('.loading').empty()
            songList.map((list)=>{
                let $li = $(`
                <a href="./playlist-detail.html?id=${list.id}">
                    <li>
                        <div class="cover">
                        <img src="${list.cover}" alt="封面">
                        </div>
                        <p>${list.name}</p>
                    </li>
                </a>`)
                this.$el.find('ol.songs').append($li)
            })        
        }
    }
    let model = {
        data:{
            songList:[],
        },
        fetch(){
            let query = new AV.Query('Playlist')
            return query.find().then((songs)=>{
                this.data.songList = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
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
            this.model.fetch().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}