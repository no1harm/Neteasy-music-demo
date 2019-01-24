{
    let view = {
        el:'#tabsNav ol.tabs-nav',
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
            this.view.$el.on('click','li',(e)=>{
                let $li = $(e.currentTarget)
                $li.addClass('active')
                .siblings('.active').removeClass('active')
                let currentPage = $li.attr('data-tab-name')
                window.eventHub.emit('selectedSingerTab',currentPage)
            })
        }
    }
    controller.init(view,model)
}