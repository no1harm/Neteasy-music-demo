{
    let view =  {
        el:'.form-container',
        init(){
            this.$el = $(this.el)
        },
        template:`
        <form class="form">
            <div class="row">
                <label>歌名</label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>歌手</label>
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label>外链</label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row">
                <button type="submit" >保存</button>
            </div>
        </form>
        `,
        render(data = {}){
            let placeholder = ['name','singer','url']
            let html = this.template
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        saveSong(data){
            let {name,singer,url} = data
            let Song = AV.Object.extend('Song');
            let song = new Song();
            song.set('name',name);
            song.set('singer',singer);
            song.set('url',url);
            return song.save().then((newSong) => {
                let {id,attributes} = newSong
                // this.data = {id,...attributes}
                Object.assign(this.data,{
                    id,
                    ...attributes
                })
            }, function (error) {
              console.error(error);
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                console.log("songForm 接受到消息")
                this.model.data = data
                this.reset(data)
            })
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.reset(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault();
                let needs = ['name','singer','url']
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.saveSong(data)
                    .then(()=>{
                        this.reset({})
                        let obj = JSON.parse(JSON.stringify(this.model.data))
                        window.eventHub.emit('create',obj)
                    })
            })
        },
        reset(data){
            this.view.render(data)
        }
    }
    controller.init(view,model)
}