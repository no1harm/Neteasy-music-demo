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
        currentSingerId:'',
        data:{
            id:'',
            name:'',
            tags:'',
            cover:'',
            summary:''
        },
        saveSinger(data,id){
            let {name,cover,tags,summary} = data
            let singer
            if(id){
                this.currentSingerId = id
                singer = AV.Object.createWithoutData('Singer',id)
            }else{
                let Singer = AV.Object.extend('Singer')
                singer = new Singer()
            }
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
                this.model.saveSinger(data,this.model.data.id).then(()=>{
                    this.reset({})
                    let copyData = JSON.parse(JSON.stringify(this.model.data))
                    if(this.model.currentSingerId){
                        alert('成功更新歌手信息！')
                        window.eventHub.emit('updateSinger',copyData)
                    }else{
                        alert('歌手创建成功！')
                        window.eventHub.emit('addSinger',copyData)
                    }
                })
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