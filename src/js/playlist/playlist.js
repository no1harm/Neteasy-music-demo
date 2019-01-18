{
    let view = {
        el:'.sumary-wrapper',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {cover,name} = data
            let $info = $(`
            <div class="cover">
                <img class="pointer" src="${cover}" alt="">
            </div>
            <div class="playlist-name">
                <p>${name}</p>
            </div>`)
            this.$el.append($info)
            this.$el.find('.blurbg').css('background-image',`url(${cover})`)
        }
    }
    let model = {
        playListId:'',
        data:{
            name:'',
            summary:'',
            cover:'',
            songlist:[]
        },
        fetch(id){
            let query = new AV.Query('Playlist')
            return query.find(id).then((songs)=>{
                Object.assign(this.data,songs[0].attributes)
                return songs
            })
        },
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.playListId = this.getPlayListId()
            this.model.fetch(this.model.playListId).then(()=>{
                this.view.render(this.model.data)
            })
        },
        getPlayListId(){
            let search = window.location.search

            search = search.substring(1)

            let arr = search.split('&').filter(v => v)

            let id = ''

            for(let i =0;i<arr.length;i++){
                let kv = arr[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                }
            }
            return id
        }
    }
    controller.init(view,model)
}