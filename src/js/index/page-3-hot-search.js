{
    let view = {
        el:'.hot-search-wrapper .search-tags',
        init(){
            this.$el = $(this.el)
        },
        render(){
            let hotSearchList = ['王菲','周杰伦','The Weeknd','陈奕迅','麦浚龙','Star boy']
            hotSearchList.map((word)=>{
                let $tag = $(`<div class="search-tag">${word}</div>`)
                this.$el.append($tag)
            })
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.view.render()
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){
            this.view.$el.find('.search-tag').on('click',(e)=>{
                let arr = []
                arr.push($(e.currentTarget).html())
                window.eventHub.emit('searchWord',arr)
                window.eventHub.emit('selectedHotWord',$(e.currentTarget).html())
            })
        },
        bindEventsHub(){
        }
    }
    controller.init(view,model)
}