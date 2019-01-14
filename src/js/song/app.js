{
    let view =  {}
    let model = {
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        setId(id){
            this.data.id = id
        },
        getSong(id){
            let query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data,song.attributes)
                return song
            }, (error)=> {
                console.log(error)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.setId(id)
            this.model.getSong(id).then((data)=>{
                console.log(this.model.data)
            })
        },
        getSongId(){
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
