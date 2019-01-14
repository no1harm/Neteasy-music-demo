
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
                audio.ontimeupdate = () =>{
                    this.showLyrics(audio.currentTime)
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
                    let time = matches[1].split(':')
                    let partTime1 = time[0]
                    let partTime2 = time[1]
                    let totalTime = parseInt(partTime1,10) * 60 + parseFloat(partTime2,10)
                    p.setAttribute('data-time',totalTime)
                }else{
                    p.textContent = string
                }

                this.$el.find('.lyric > .lines').append(p)
            })
        },
        showLyrics(time){
            let allP = this.$el.find('.lyric > .lines > p')
            let p
            for(let i=0;i<allP.length;i++){
                if(i === allP.length - 1){
                    p = allP[i]
                    break
                }else{
                    let currentTime = allP.eq(1).attr('data-time')
                    let nextTime = allP.eq(i+1).attr('data-time')
                    if(currentTime <= time && time < nextTime){
                        p = allP[i]
                        break
                    }
                }
            }
            console.log(p)
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = this.$el.find('.lyric > .lines')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight
            this.$el.find('.lyric > .lines').css({
                transform:`translateY(${-(height - 25)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
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
