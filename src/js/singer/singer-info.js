{
    let view = {
        el:'',
        init(){}
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = window.parseUrl.getId()
            console.log(id)
        }
    }
    controller.init(view,model)
}