{
    let view = {
        el:'.song-list-warpper',
        init(){
            this.$el = $(this.el)
            this.$form = this.$el.find('form')
        },
        render(data){
            let {name,id,cover,tags,summary} = data
            let attr = ['name','cover','tags','summary']
            attr.map((a)=>{
                this.$form.find(`[name="${a}"]`).val(data[a])
            })
        }
    }
    let model = {
        createOrUpdate:'',
        songListId:'',
        data:{
            name:'',
            id:'',
            cover:'',
            tags:'',
            summary:''
        },
        createSongList(data){
            let Playlist = AV.Object.extend('Playlist')
            let playlist = new Playlist()
            playlist.set('name', data.name)
            playlist.set('summary', data.summary)
            playlist.set('cover', data.cover)
            playlist.set('tags', data.tags)
            return playlist.save().then((newSongList) => {
                this.songListId = newSongList.id
            })
        },
        updateSongList(data){
            let {name,cover,tags,summary} = data
            let list = AV.Object.createWithoutData('Playlist',this.data.id)
            list.set('name', name)
            list.set('cover', cover)
            list.set('tags', tags)
            list.set('summary', summary)
            return list.save().then((data)=>{
                Object.assign(this.data,data)
                return data
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view 
            this.view.init()
            this.model = model
            this.model.createOrUpdate = this.getUrl()
            this.bindEvents()
            this.bindEventsHub()
        },
        bindEvents(){           
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                let form = this.view.$form.get(0)
                let keys = ['name','summary','cover','tags']
                let data = {}
                keys.reduce((prev,item)=>{
                    prev[item] = form[item].value
                    return prev
                },data)
                if(this.model.createOrUpdate === 'create-list'){
                    this.model.createSongList(data).then(()=>{
                    })
                    window.location.href = `./edit-song-list.html?id=${this.model.songListId}`
                }else{
                    this.model.updateSongList(data).then(()=>{
                        alert('updated!')
                        window.location.href = `./edit-song-list.html?id=${this.model.data.id}` 
                    })
                }
            })
        },
        bindEventsHub(){
            window.eventHub.on('selectPlayList',(data)=>{
                Object.assign(this.model.data,data)
                this.view.render(data)
            })
        },
        getUrl(){
            let search = window.location.search

            search = search.substring(1)

            return search
        },
        isUpdate(){
            this.model.fetch()
        }
    }
    controller.init(view,model)
}