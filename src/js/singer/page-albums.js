{
    let view = {
        el:'.tab-content .page-albums',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view 
            this.view.init()
            this.model = model
            this.bindEventsHub()
        },
        bindEventsHub(){
            window.eventHub.on('selectedSingerTab',(data)=>{
                if(data === 'page-albums'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}