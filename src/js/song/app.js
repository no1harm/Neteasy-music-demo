{
    let view =  {
        el:"#app",
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {song,status} = data
            this.$el.css('background-image',`url(${song.cover})`)
            this.$el.find('img.cover').attr('src',song.cover)
            if(this.$el.find('audio').attr('src') !== song.url){
                let audio = this.$el.find('audio').attr('src',song.url).get(0)
                audio.onended = () =>{
                    window.eventHub.emit('songEnd')
                }
            }
            if(status === 'playing'){
                this.$el.find('.disc-container').addClass('playing')
            }else{
                this.$el.find('.disc-container').removeClass('playing')
            }
            this.$el.find('.song-description > h1').text(song.name)
            let array = song.lyrics.split('\n')
            array.map((string)=>{
                let p = document.createElement('p')

                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                if(matches){
                    p.textContent = matches[2]
                    p.setAttribute('data-time',matches[1])
                }else{
                    p.textContent = string
                }

                this.$el.find('.lyric > .lines').append(p)
            })
        },
        play(){
            let audio = this.$el.find('audio')[0]
            audio.play()
        },
        pause(){
            let audio = this.$el.find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data:{
            song:{
                name:'',
                singer:'',
                url:'',
                id:'',
                cover:'',
                lyrics:''
            },
            status:'paused'
        },
        setId(id){
            this.data.song.id = id
        },
        getSong(id){
            let query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song,song.attributes)
                return song
            }, (error)=> {
                console.log(error)
            })
        },
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.setId(id)
            this.model.getSong(id).then((data)=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.on('click','.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            this.view.$el.on('click','.icon-pause',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
        },
        bindEventsHub(){
            window.eventHub.on('songEnd',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
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
