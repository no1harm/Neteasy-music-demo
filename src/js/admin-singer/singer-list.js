{
    let view = {
        el:'.singer-list-wrapper ol.singer-list',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            data.map( singer => {
                let $li = $(`<li data-singer-id="${singer.id}">${singer.name}</li>`)
                this.$el.append($li)
            })
        }
    }
    let model = {
        data:{
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
                this.view.render(this.model.data.singers)
            })
        }
    }
    controller.init(view,model)
}