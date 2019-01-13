{
    let view = {
        el:"#tabsNav",
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
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav > li',(e)=>{
                let $li = $(e.currentTarget)
                $li.addClass('active')
                    .siblings().removeClass('active')
            })
        },
        bindEventsHub(){}
    }
    controller.init(view,model)
}