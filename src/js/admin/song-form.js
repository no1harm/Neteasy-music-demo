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
                <label>封面</label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row">
                <label>歌词</label>
                <textarea cols=80 rows=10 name="lyrics">__lyrics__</textarea>
            </div>
            <div class="row">
                <button type="submit" >保存</button>
            </div>
        </form>
        `,
        render(data = {}){
            let placeholder = ['name','singer','url','cover','lyrics']
            let html = this.template
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        }
    }
    let model = {
        data:{
            name:'',
            singer:'',
            url:'',
            id:'',
            cover:'',
            lyrics:''
        },
        saveSong(data){
            let {name,singer,url,cover,lyrics} = data
            let Song = AV.Object.extend('Song');
            let song = new Song();
            song.set('name',name);
            song.set('singer',singer);
            song.set('url',url);
            song.set('cover',cover);
            song.set('lyrics',lyrics);
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
        },
        update(data){
            let {name,url,singer,cover,lyrics} = data
            let id = this.data.id
            let song = AV.Object.createWithoutData('Song',id)
            song.set('name', name)
            song.set('url', url)
            song.set('singer', singer)
            song.set('cover', cover)
            song.set('lyrics', lyrics)
            return song.save().then((res)=>{
                Object.assign(this.data,data)
                return res
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            this.bindEventHub()
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }
                
            })
        },
        bindEventHub(){
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.reset(this.model.data)
            })
            window.eventHub.on('newSong',(data)=>{
                if(this.model.data.id){
                    this.model.data = {
                        name:'',
                        singer:'',
                        url:'',
                        id:'',
                        cover:''
                    }
                }else{
                    Object.assign(this.model.data,data)
                }
                this.reset(this.model.data)
            })
        },
        create(){
            let needs = ['name','singer','url','cover','lyrics']
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
        },
        update(){
            let needs = ['name','singer','url','cover','lyrics']
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(()=>{
                    alert('Update Successful')
                    window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        reset(data){
            this.view.render(data)
        }
    }
    controller.init(view,model)
}