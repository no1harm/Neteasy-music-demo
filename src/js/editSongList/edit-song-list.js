{
    let view = {
        el:'.edit-song-list-wrapper',
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
        }
    }
    controller.init(view,model)
}