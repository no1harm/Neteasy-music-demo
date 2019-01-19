{
    let view = {
        el:".page-3",
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
    let model = {
        search(string){
            console.log(string)
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.find('#search').keypress((e)=>{
                if(e.keyCode === 13){
                    let string = e.currentTarget.value
                    this.model.search(string)
                }
            })
        },
        bindEventsHub(){
            window.eventHub.on('selectedTab',(data)=>{
                if(data === 'page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}