{
    let view = {
        el:'.tab-content .page-desc',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let $p
            if(data){
                $p = $(`<p>${data}</p>`)
            }else{
                $p = $(`<span>该歌手尚未增添简介。</span>`)
            }
            this.$el.find('section.singer-desc').append($p)
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
                if(data === 'page-desc'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
            window.eventHub.on('singerDesc',(data)=>{
                this.view.render(data)
            })
        }
    }
    controller.init(view,model)
}