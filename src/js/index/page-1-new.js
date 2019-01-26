{
    let view = {
        el:"section.songs",
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data
            this.$el.find('.loading').empty()
            songs.map((song)=>{
                let $li = $(`
                <li>
                <h3>${song.name}</h3>
                <p>
                    <svg class="icon icon-sq">
                    <use xlink:href="#icon-sq"></use>
                    </svg>
                    ${song.singer}
                </p>
                <a class="playButton" href="./song.html?id=${song.id}">
                    <svg class="icon icon-play">
                    <use xlink:href="#icon-play"></use>
                    </svg>
                </a>
                </li>
                `)
                this.$el.find('ol.list').append($li)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        },
        fetch(){
            let query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvent()
            this.getSongs()
        },
        bindEvent(){

        },
        getSongs(){
            this.model.fetch().then(()=>{
                this.view.render(this.model.data)
                this.setLocalStorage()
            })
        },
        setLocalStorage(){
            let storage = localStorage.getItem('globalPlayList')
            localStorage.removeItem('globalPlayList');
            let list = []
            this.model.data.songs.map(song => {
                list.push(song.id)
            })
            let string = list.join(',')
            localStorage.setItem('globalPlayList', string)
        }
    }
    controller.init(view,model)
}