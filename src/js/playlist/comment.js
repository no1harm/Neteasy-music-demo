{
    let view = {
        el:'section.comments',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {
        playListId:'',
        fetch(data){}
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventsHub()
            this.model.fetch(this.model.playListId)
            this.bindeEvents()
        },
        bindeEvents(){
            this.view.$el.on('click','#submit-comment',(e)=>{
                let value = this.view.$el.find('.comment-input').text()
                console.log(value)
            })
        },
        bindEventsHub(){
            window.eventHub.on('playListId',data =>{
                this.model.playListId = data
            })
        }
    }
    controller.init(view,model)
}