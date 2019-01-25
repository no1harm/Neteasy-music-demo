{
    let view = {
        el:'.history-search-wrapper .search-tags',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.html('')
            if(data.lenght !== 0){
                data.map((string)=>{
                    let $div = $(`<div class="search-tag">${string}</div>`)
                    this.$el.append($div)
                })
            }else{
                let $div = $(`<div class="search-tag">暂无历史搜索</div>`)
                this.$el.append($div)
            }
        }
    }
    let model = {
        searchHistory:[]
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.getLocalStorage()
            this.view.render(this.model.searchHistory)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents(){
            this.view.$el.find('.search-tag').on('click',(e)=>{
                let arr = []
                arr.push($(e.currentTarget).html())
                console.log(arr)
                window.eventHub.emit('searchWord',arr)
            })
        },
        getLocalStorage(){
            let storage = localStorage.getItem('searchHistory')
            if(storage){
                let list = storage.split(',')
                this.model.searchHistory = list
            }
        },
        bindEventHub(){
            window.eventHub.on('prependSearchTag',(data)=>{
                this.model.searchHistory.unshift(data)
                this.view.render(this.model.searchHistory)
            })
        }
    }
    controller.init(view,model)
}