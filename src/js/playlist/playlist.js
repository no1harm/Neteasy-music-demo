{
    let view = {
        el:'.playlist-info',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {cover,name,summary,tags} = data
            let tagsList = tags.split(' ')
            tagsList.map((tag)=>{
                let $tag = $(`<div class="tag">${tag}</div>`)
                this.$el.find('.tags .tag-list').append($tag)

            })
            let $info = $(`
            <div class="cover">
                <img class="pointer" src="${cover}" alt="">
            </div>
            <div class="playlist-name">
                <p>${name}</p>
            </div>`)
            let $summary = $(`
            <p>${summary}</p>
            `)
            this.$el.find('.sumary-wrapper').append($info)
            this.$el.find('.blurbg').css('background-image',`url(${cover})`)
            this.$el.find('.summary').append($summary)
        }
    }
    let model = {
        playListId:'',
        data:{
            name:'',
            summary:'',
            cover:'',
            tags:'',
            songlist:[]
        },
        fetch(id){
            let query = new AV.Query('Playlist')
            return query.get(id).then((song)=>{
                Object.assign(this.data,song.attributes)
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
                window.eventHub.emit('playListId',this.model.playListId)
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