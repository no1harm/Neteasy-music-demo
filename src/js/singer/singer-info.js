{
    let view = {
        el:'#singer-info-wrapper',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            if(data){
                this.$el.find('.singer-cover').css("background-image",`url(${data.cover})`)
                if(data.tags){
                    let tagsList = data.tags.split(' ')
                    tagsList.map((tag)=>{
                        let $tag = $(`<div class="tag">${tag}</div>`)
                        this.$el.find('.singer-tags').append($tag)
                    })
                }else{
                    let $tag = $(`<div class="tag">歌手</div>`)
                    this.$el.find('.singer-tags').append($tag)
                }
                this.$el.find('.singer-info h1').html(data.name)
            }
        }
    }
    let model = {
        data:{
            name:'',
            tags:'',
            cover:'',
            summary:''
        },
        fetch(id){
            let query = new AV.Query('Singer');
            return query.get(id).then((singer) => {
                Object.assign(this.data,singer.attributes)
                return singer
            }, (error)=> {
                console.log(error)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = window.parseUrl.getId()
            this.model.fetch(id).then(()=>{
                this.view.render(this.model.data)
                window.eventHub.emit('singerDesc',this.model.data.summary)
            })
        }
    }
    controller.init(view,model)
}