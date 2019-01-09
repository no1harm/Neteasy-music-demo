{
    let view = {
        el:'.songList-container',
        template:`
        <ul class="song-list">
            <li>新建歌曲1</li>
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
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                console.log("songList 接受到消息")
                console.log(data)
            })
        }
    }
    controller.init(view,model)
}