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
        },
        getUrl(){
            let search = window.location.search

            search = search.substring(1)

            return search
        },
    }
    controller.init(view,model)
}