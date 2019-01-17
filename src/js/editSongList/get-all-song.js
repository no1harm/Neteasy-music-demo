{
    let view = {
        el:'.all-songs-list',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {
        data:{
            songs:[],
            selectedSongId:undefined
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
            this.model.find()
            console.log(this.model.data)
        }
    }
    controller.init(view,model)
}