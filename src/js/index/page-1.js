{
    let view = {
        el:".page-1",
        init(){
            this.$el = $(this.el)
        },
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.loadModule1()
            this.loadModule2()
            this.loadModule3()
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
        },
        loadModule3(){
            let script = document.createElement('script')
            script.src = "./js/index/page-1-singer.js"
            script.onload = function(){
            }
            document.body.appendChild(script)
        }
    }
    controller.init(view,model)
}