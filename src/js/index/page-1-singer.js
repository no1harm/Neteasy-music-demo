{
    let view = {
        el:'section.singers',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            if(data){
                data.map((singer)=>{
                    let $li = this.getLi(singer)
                    $li.find('.cover').css('background-image',`url(${singer.cover})`)
                    this.$el.find('ol.singers').append($li)
                })
            }
        },
        getLi(data){
            return $(`
            <a href="./singer-detail.html?id=${data.id}">
                <li>
                    <div class="cover"></div>
                    <p>${data.name}</p>
                </li>
            </a>
            `)
        }
    }
    let model = {
        data:{
            singers:[],
        },
        fetch(){
            let query = new AV.Query('Singer')
            return query.find().then((singers)=>{
                this.data.singers = singers.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return singers
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.fetch().then(()=>{
                this.view.render(this.model.data.singers)
            })
        }
    }
    controller.init(view,model)
}