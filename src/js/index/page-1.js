{
    let view = {
        el:".page-1",
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
            this.loadModule1()
            this.loadModule2()
        },
        bindEventsHub(){
            window.eventHub.on('selectedTab',(data)=>{
                if(data === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script = document.createElement('script')
            script.src = "./js/index/page-1-recommend.js"
            script.onload = function(){
            }
            document.body.appendChild(script)
        },
        loadModule2(){
            let script = document.createElement('script')
            script.src = "./js/index/page-1-new.js"
            script.onload = function(){
            }
            document.body.appendChild(script)
        }
    }
    controller.init(view,model)
}