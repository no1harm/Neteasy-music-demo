{
    let view =  {
        el:'.form-container',
        template:`
        <form class="form">
            <div class="row">
                <label>歌名</label>
                <input type="text" value="__key__">
            </div>
            <div class="row">
                <label>歌手</label>
                <input type="text" value="歌手">
            </div>
            <div class="row">
                <label>外链</label>
                <input type="text" value="__link__">
            </div>
            <input type="button" value="保存">
        </form>
        `,
        render(data = {}){
            let placeholder = ['key','link']
            let html = this.template
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                console.log("songForm 接受到消息")
                console.log(data)
                this.reset(data)
            })
        },
        reset(data){
            this.view.render(data)
        }
    }
    controller.init(view,model)
}