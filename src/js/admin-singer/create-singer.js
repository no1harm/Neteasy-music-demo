{
    let view = {
        el:'.form-wrapper form',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {name,cover,tags,summary} = data
            let renderElement = ['name','cover','tags','summary']
            renderElement.map((string) => {
                this.$el.find(`input[name=${string}]`).val(data[string])
            })
        }
    }
    let model = {
        data:{
            id:'',
            name:'',
            tags:'',
            cover:'',
            summary:''
        },
        saveSinger(data){
            let {name,cover,tags,summary} = data
            let Singer = AV.Object.extend('Singer')
            let singer = new Singer()
            singer.set('name',name)
            singer.set('cover',cover)
            singer.set('tags',tags)
            singer.set('summary',summary)
            return singer.save().then((newSinger) => {
                let {id,attributes} = newSinger
                Object.assign(this.data,{
                    id,
                    ...attributes
                })
            }, function (error) {
              console.error(error)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view 
            this.model = model
            this.view.init()
            this.init.model = model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('submit',(e)=>{
                e.preventDefault()

                let needs = ['name','cover','tags','summary']
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.saveSinger(data)
                    .then(()=>{
                        this.reset({})
                        alert('歌手创建成功！')
                        let obj = JSON.parse(JSON.stringify(this.model.data))
                        console.log(obj)
                        // window.eventHub.emit('create',obj)
                    })
                })
        },
        reset(data){
            this.view.render(data)
        }
    }
    controller.init(view,model)
}