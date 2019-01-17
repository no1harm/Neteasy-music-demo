{
    let view = {
        el:'.song-list-warpper',
        init(){
            this.$el = $(this.el)
            this.$form = this.$el.find('form')
        }
    }
    let model = {
        createSongList(data){
            let Playlist = AV.Object.extend('Playlist')
            let playlist = new Playlist()
            playlist.set('name', data.name)
            playlist.set('summary', data.summary)
            return playlist.save().then((newSong) => {
                console.log(newSong.id)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view 
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                let form = this.view.$form.get(0)
                let keys = ['name','summary']
                let data = {}
                keys.reduce((prev,item)=>{
                    prev[item] = form[item].value
                    return prev
                },data)
                this.model.createSongList(data).then(()=>{
                    
                })
            })
        }
    }
    controller.init(view,model)
}