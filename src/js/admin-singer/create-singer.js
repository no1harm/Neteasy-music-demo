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
        createSinger(data){
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
        },
        updateSinger(data,id){
            let {name,cover,tags,summary} = data
            let singer = AV.Object.createWithoutData('Singer',id)
            singer.set('name',name)
            singer.set('cover',cover)
            singer.set('tags',tags)
            singer.set('summary',summary)
            return singer.save().then((updatedSinger)=>{
                let {id,attributes} = updatedSinger
                Object.assign(this.data,{
                    id,
                    ...attributes
                })
                return singer
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view 
            this.model = model
            this.view.init()
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.on('submit',(e)=>{
                e.preventDefault()

                let needs = ['name','cover','tags','summary']
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                console.log(this.model.data.id)
                if(this.model.data.id){
                    this.model.updateSinger(data,this.model.data.id).then(()=>{
                        this.reset({})
                        alert('成功更新歌手信息！')
                    })
                }else{
                    this.model.createSinger(data)
                    .then(()=>{
                        this.reset({})
                        alert('歌手创建成功！')
                        let obj = JSON.parse(JSON.stringify(this.model.data))
                        // console.log(obj)
                        // window.eventHub.emit('create',obj)
                    })
                }
            })
        },
        bindEventsHub(){
            window.eventHub.on('selectedSinger',(data)=>{
                Object.assign(this.model.data,data)
                this.reset(data)
            })
        },
        reset(data){
            this.view.render(data)
        }
    }
    controller.init(view,model)
}