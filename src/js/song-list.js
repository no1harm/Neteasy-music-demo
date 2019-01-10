{
    let view = {
        el:'.songList-container',
        template:`
        <ul class="song-list">      
        </ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let liList = []
            let $el = $(this.el)
            $el.find('ul').empty()
            data.songs.map((song)=>{
                $el.find('ul').append($('<li></li>').text(song.name))
            })
        },
        removeActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data:{
            songs:[]
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
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.view.removeActive()
            })
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
    }
    controller.init(view,model)
}