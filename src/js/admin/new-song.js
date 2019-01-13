{
    let view = {
        el:'.new-song',
        template:`新建歌曲`,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            this.bindEvents()          
            this.bindEventHub()
        },
        bindEvents(){
            $(this.view.el).on('click',()=>{
                window.eventHub.emit('newSong')
            })
        },
        bindEventHub(){
            window.eventHub.on('select',(data)=>{
                this.removeActive()
            })
            window.eventHub.on('newSong',(data)=>{
                this.active()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        removeActive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view,model)
}