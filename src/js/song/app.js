{
    let view =  {
        el:"#app",
        template:`
        <audio src={{url}}></audio>
        <div>
            <button class="play">播放</button>
            <button class="pause">暂停</button>
        </div>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.html(this.template.replace("{{url}}",data.url))
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
            name:'',
            singer:'',
            url:'',
            id:''
        },
        setId(id){
            this.data.id = id
        },
        getSong(id){
            let query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data,song.attributes)
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
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.play',()=>{
                this.view.play()
            })
            this.view.$el.on('click','.pause',()=>{
                this.view.pause()
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
