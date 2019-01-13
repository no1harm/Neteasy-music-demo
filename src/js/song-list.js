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
                $el.find('ul').append($('<li></li>').text(song.name).attr("data-song-id",song.id))
            })
        },
        addActive(selected){
            $(selected).addClass('active')
                .siblings('.active').removeClass('active')
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
            this.bindEventsHub()
            this.bindEvents()
            this.getAllSongs()        
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                this.view.addActive(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                let data
                let songs = this.model.data.songs
                for(let i = 0;i<songs.length;i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                let copyData = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select',copyData)
            })
        },
        bindEventsHub(){
            window.eventHub.on('upload',(data)=>{
                this.view.removeActive()
            })
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('newSong',()=>{
                this.view.removeActive()
            })
        }
    }
    controller.init(view,model)
}