{
    let view = {
        el:'.singer-list-wrapper .createSinger',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click',(e)=>{
                window.eventHub.emit('createSinger')
            })
        }
    }
    controller.init(view,model)
}