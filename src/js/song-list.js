{
    let view = {
        el:'.songList-container',
        template:`
        <ul class="song-list">
            <li class="active">新建歌曲1</li>
            <li>新建歌曲2</li>
            <li>新建歌曲3</li>
            <li>新建歌曲4</li>
            <li>新建歌曲5</li>
            <li>新建歌曲6</li>
            <li>新建歌曲7</li>
            <li>新建歌曲8</li>
            <li>新建歌曲9</li>
            <li>新建歌曲10</li>
        </ul>
        `,
        render(data){
            $(this.el).html(this.template)
        },
        removeActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.view.removeActive()
            })
        },
    }
    controller.init(view,model)
}