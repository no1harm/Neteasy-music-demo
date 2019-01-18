{
    let view = {
        el:'.playlists',
        init(){
            this.$el = $(this.el)
        },
        show(list){
            list.map((string)=>{
                $li = $(`
                <li data-list-id="${string.id}">${string.name}</li>
                `) 
                this.$el.find('ol').append($li)
            })
        },
        hide(){
            this.$el.css('display','none')
        }
    }
    let model = {
        data:{
            selectedListId:'',
            songList:[]
        },
        isUpdate:'',
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
            this.model.isUpdate = this.getUrl()
            if(this.model.isUpdate === 'update-list'){
                this.model.fetch().then(()=>{
                    this.view.show(this.model.data.songList)
                })
            }else{
                this.view.hide()
            }
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                let listId = e.currentTarget.getAttribute('data-list-id')
                this.model.data.selectedListId = listId
                let data
                let songList = this.model.data.songList
                for(let i = 0;i<songList.length;i++){
                    if(songList[i].id === listId){
                        data = songList[i]
                        break
                    }
                }
                let copyData = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('selectPlayList',copyData)
            })
        },
        getUrl(){
            let search = window.location.search

            search = search.substring(1)

            return search
        },
    }
    controller.init(view,model)
}