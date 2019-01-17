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
            selectedSongsId:[],
            songListId:''
        },
        find(){
            let query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            })
        },
        addSongToList(data){
            let promise = []
            let {selectedSongsId,songListId} = data
            let Playlist = AV.Object.createWithoutData('Playlist',songListId)
            selectedSongsId.map((songId)=>{
                let song = AV.Object.createWithoutData('Song',songId)
                song.set('dependent', Playlist)
                promise.push(
                    song.save().then((data) => {
                    })
                )
            })
            // console.log(promise)
            return Promise.all(promise).then(()=>{
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.data.songListId = this.getSongId()
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
                this.model.data.selectedSongsId = checkedSong
                
                this.model.addSongToList(this.model.data).then(()=>{
                    // console.log(2)
                })
            })
        },
        getSongId(){
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