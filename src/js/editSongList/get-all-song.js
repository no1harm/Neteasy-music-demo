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
        },
        reRender(idList){
            idList.map((id)=>{
                let inputs = document.querySelectorAll('form input')
                for(let i=0;i<inputs.length;i++){
                    if(id === inputs[i].getAttribute('data-song-id')){
                        inputs[i].checked = true
                    }
                }
            })
        }
    }
    let model = {
        data:{
            songs:[],
            selectedSongsId:[],
            songListId:'',
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
        createOrUpdate(id){
            let playlist = AV.Object.createWithoutData('Playlist', id)
            let query = new AV.Query('PlayListMap')
            query.equalTo('playlist', playlist)
            return query.find().then( (lists) => {
                if(Array.isArray(lists) && lists.length === 0){
                    return 1
                }else{
                    lists.forEach( (scm, i, a) => {
                        let song = scm.get('song')
                        this.data.selectedSongsId.push(song.id)
                    })
                    return lists
                }
            })
        },
        addSongToList(data){
            let promise = []
            let {selectedSongsId,songListId} = data
            selectedSongsId.map((songId)=>{
                let playlist = AV.Object.createWithoutData('Playlist',songListId)
                let playListMap = new AV.Object('PlayListMap')
                let song = AV.Object.createWithoutData('Song',songId)
                playListMap.set('playlist', playlist)
                playListMap.set('song', song)
                promise.push(
                    playListMap.save().then(()=>{
                        console.log('成功保存')
                    })
                )
            })
            return Promise.all(promise).then(()=>{
            })
        },
        deleteSongFromList(ids){
            let notCheckedSong = []
            let $notCheckedSongList = $("input[name='selectedSong']").not(':checked')
            for(let i=0;i<$notCheckedSongList.length;i++){
                let id = $notCheckedSongList[i].getAttribute('data-song-id')
                notCheckedSong.push(id)
            }
            let promise = []

            let playlist = AV.Object.createWithoutData('Playlist', this.data.songListId)

            let query = new AV.Query('PlayListMap')

            query.equalTo('playlist', playlist)

            notCheckedSong.map((songId)=>{
                promise.push(
                    query.find().then( (songs) => {
                
                        songs.forEach( (scm, i, a) => {
                            let song = scm.get('song')
                            if(song.id === songId){
                                let todo = AV.Object.createWithoutData('PlayListMap', scm.id);
                                todo.destroy().then( (success) => {
                                    console.log('delected!')
                                }, function (error) {
                                    // 删除失败
                                });
                            }
                        })
                        return songs
                    })
                )
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
            this.model.data.songListId = this.getSongId()
            this.model.find().then(()=>{
                this.view.render(this.model.data)
                this.model.createOrUpdate(this.model.data.songListId).then((data)=>{
                    if(data === 1){
                        console.log('是在创建歌单')                    
                    }else{
                        console.log('是在更新歌单')
                        console.log(this.model.data.selectedSongsId)
                        this.view.reRender(this.model.data.selectedSongsId)
                    }
                })
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
                    if(this.model.data.selectedSongsId.indexOf(id) === -1){
                        checkedSong.push(id)
                    }
                }
                this.model.data.selectedSongsId = []
                this.model.data.selectedSongsId = checkedSong
                
                this.model.deleteSongFromList(this.model.data.selectedSongsId).then(()=>{})
                this.model.addSongToList(this.model.data).then(()=>{
                    alert('歌曲已成功添加至歌单')
                    window.location.href = './admin.html'
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