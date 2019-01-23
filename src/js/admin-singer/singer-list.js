{
    let view = {
        el:'.singer-list-wrapper ol.singer-list',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.empty()
            let {selectedSingerId,singers} = data
            singers.map( singer => {
                let $li = $(`<li data-singer-id="${singer.id}">${singer.name}</li>`)
                if(singer.id === selectedSingerId){
                    $li.addClass('active')
                }
                this.$el.append($li)
            })
        },
        updateSinger(data){
            this.$el.find(`[data-singer-id="${data.id}"]`).html(data.name)
        }
    }
    let model = {
        data:{
            selectedSingerId:'',
            singers:[]
        },
        fetch(){
            let query = new AV.Query('Singer')
            return query.find().then((singers)=>{
                this.data.singers = singers.map((singer)=>{
                    return {id:singer.id,...singer.attributes}
                })
                return singers
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.fetch().then( data =>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                let selectedSingerId = e.currentTarget.getAttribute('data-singer-id')
                this.model.data.selectedSingerId = selectedSingerId
                this.view.render(this.model.data)
                let data = {}
                let list = this.model.data.singers
                for(let i=0;i<list.length;i++){
                    if(list[i].id === selectedSingerId){
                        data = list[i]
                        break
                    }
                }
                let copyData = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('selectedSinger',copyData)
            })
        },
        bindEventsHub(){
            window.eventHub.on('updateSinger',(data) => {
                let list = this.model.data.singers
                for(let i=0;i<list.length;i++){
                    if(list[i].id === data.id){
                        this.model.data.singers[i] = data
                        break
                    }
                }
                this.view.updateSinger(data)
            })
            window.eventHub.on('addSinger',(data) => {
                this.model.data.singers.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}