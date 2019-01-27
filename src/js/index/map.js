{
    let view = {
        el:'',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {
        data:{
            songIdList:[]
        },
        fetchAnd(){
            let playlist = AV.Object.createWithoutData('Playlist', '5c41d9089f5454007048e45b')

            let query = new AV.Query('PlayListMap')

            query.equalTo('playlist', playlist)

            return query.find().then( (songs) => {
                
                songs.forEach( (scm, i, a) => {
                    let song = scm.get('song')
                    if(song.id === '5c4c6f5b9f545400471b2028'){
                        console.log(song.id)
                        console.log(scm.id)
                        let todo = AV.Object.createWithoutData('PlayListMap', scm.id);
                        todo.destroy().then( (success) => {
                            console.log('delected!')
                        }, function (error) {
                            // 删除失败
                        });
                    }
                })
                return songs
            })
        },
        set(){
            let song = AV.Object.createWithoutData('Song','5c3c7a688d6d810acc80f536')

            let playlist = AV.Object.createWithoutData('Playlist','5c41d9089f5454007048e45b')
        
            let playListMap = new AV.Object('PlayListMap')
        
            // 设置关联
            playListMap.set('playlist', playlist)
            playListMap.set('song', song)
        
            // 保存选课表对象
            return playListMap.save()
        },
        fetch(){
            let playlist = AV.Object.createWithoutData('Playlist', '5c41d9089f5454007048e45b')

            let query = new AV.Query('PlayListMap')

            query.equalTo('playlist', playlist)

            return query.find().then( (songs) => {
                
                songs.forEach( (scm, i, a) => {
                    let song = scm.get('song')
                    this.data.songIdList.push(song.id)
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
            // this.model.set().then(()=>{
            //     console.log('done')
            // })
            // this.model.fetch().then(()=>{
            //     // console.log(this.model.data.songIdList)
            // })
            // this.model.fetchAnd()
        }
    }
    controller.init(view,model)
}