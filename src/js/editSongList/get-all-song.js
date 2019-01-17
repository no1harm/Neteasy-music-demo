{
    let view = {
        el:'.all-songs-list',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data
            songs.map((song)=>{
                let $div = `
                <div>
                    <input type="checkbox" id="${song.id}" name="selectedSong" value="${song.id}" data-song-id="${song.id}">
                    <label for="${song.id}">${song.name}</label>
                </div>
              `
                // let $li = `<li data-song-id="${song.id}">${song.name}</li>`
                this.$el.find('form').append($div)
            })
            this.$el.find('form').append(`<button type="submit">提交</button>`)
        }
    }
    let model = {
        data:{
            songs:[],
            selectedSongs:[]
        },
        find(){
            let query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
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
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                
                let checkedSong = []
                let $checkedSongList = $("input[name='selectedSong']:checked")
                for(let i=0;i<$checkedSongList.length;i++){
                    let id = $checkedSongList[i].getAttribute('data-song-id')
                    checkedSong.push(id)
                }
                this.model.selectedSongs = checkedSong
                console.log(this.model.selectedSongs)
            })
        }
    }
    controller.init(view,model)
}