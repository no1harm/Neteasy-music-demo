
{
    let view =  {
        el:"#app",
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {song,status} = data
            this.$el.find('.blur-bg').css('background-image',`url(${song.cover})`)
            this.$el.find('img.cover').attr('src',song.cover)
            if(this.$el.find('audio').attr('src') !== song.url){
                let audio = this.$el.find('audio').attr('src',song.url).get(0)
                audio.onended = () =>{
                    window.eventHub.emit('songEnd')
                }
                audio.ontimeupdate = () =>{
                    this.showLyrics(audio.currentTime)

                    this.updateProgress(audio)
                }
                audio.onloadedmetadata = () =>{
                    this.$el.find('.audio-length-total').html(this.transTime(audio.duration))
                }
                audio.onended = () =>{
                    this.audioEnded()
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
        transTime(value){
            var time = "";
            var h = parseInt(value / 3600);
            value %= 3600;
            var m = parseInt(value / 60);
            var s = parseInt(value % 60);
            if (h > 0) {
                time = this.formatTime(h + ":" + m + ":" + s);
            } else {
                time = this.formatTime(m + ":" + s);
            }
        
            return time;
        },
        formatTime(value) {
            var time = "";
            var s = value.split(':');
            var i = 0;
            for (; i < s.length - 1; i++) {
                time += s[i].length == 1 ? ("0" + s[i]) : s[i];
                time += ":";
            }
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        
            return time;
        },
        updateProgress(audio){
            let value = audio.currentTime / audio.duration
            $('#progressBar').css('width', value * 100 + '%')
            $('#progressDot').css('left', value * 100 + '%')
            $('#audioCurTime').html(this.transTime(audio.currentTime))
        },
        showLyrics(time){
            let allP = this.$el.find('.lyric > .lines > p')
            let p
            for(let i=0;i<allP.length;i++){
                if(i === allP.length-1){
                    p = allP[i]
                    break
                }else{
                    let currentTime = allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i+1).attr('data-time')                    
                    if(currentTime <= time && time < nextTime){
                        p = allP[i]
                        break
                    }
                }
            }
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
        },
        audioEnded(){
            $('#progressBar').css('width', 0);
            $('#progressDot').css('left', 0);
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
            this.progressBarListener()
        },
        bindEventsHub(){
            window.eventHub.on('songEnd',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
        },
        progressBarListener(){
            let position = {
                oriOffestLeft: 0, // 移动开始时进度条的点距离进度条的偏移值
                oriX: 0, // 移动开始时的x坐标
                maxLeft: 0, // 向左最大可拖动距离
                maxRight: 0 // 向右最大可拖动距离
            }
            let flag = false; // 标记是否拖动开始
            let audio = this.view.$el.find('audio').get(0)
            let dot = this.view.$el.find('#progressDot').get(0)
            this.view.$el.on('touchstart','#progressDot',(event)=>{
                if (!audio.paused || audio.currentTime != 0) { // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
                    flag = true;
        
                    position.oriOffestLeft = dot.offsetLeft;
                    position.oriX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
                    position.maxLeft = position.oriOffestLeft; // 向左最大可拖动距离
                    position.maxRight = document.getElementById('progressBarBg').offsetWidth - position.oriOffestLeft; // 向右最大可拖动距离
        
                    // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
                    if (event && event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false;
                    }
        
                    // 禁止事件冒泡
                    if (event && event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        window.event.cancelBubble = true;
                    }
                }
            })
            this.view.$el.on('touchmove','#progressDot',(event)=>{
                if (flag) {
                    var clientX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
                    var length = clientX - position.oriX;
                    if (length > position.maxRight) {
                        length = position.maxRight;
                    } else if (length < -position.maxLeft) {
                        length = -position.maxLeft;
                    }
                    var pgsWidth = $('.progress-bar-bg').width();
                    var rate = (position.oriOffestLeft + length) / pgsWidth;
                    audio.currentTime = audio.duration * rate;
                    this.view.updateProgress(audio);
                }
            })
            this.view.$el.on('touchend','#progressDot',(event)=>{
                flag = false;
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
