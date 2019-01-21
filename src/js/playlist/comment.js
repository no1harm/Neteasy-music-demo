{
    let view = {
        el:'section.comments',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let $li = $(`
            <li><li>
            `)
        }
    }
    let model = {
        playListId:'',
        comments:[],
        currentComment:{},
        fetch(data){},
        setComment(data){
            let playlist = AV.Object.createWithoutData('Playlist',this.playListId)
            let Comments = AV.Object.extend('Comments')
            let comment = new Comments()
            comment.set('name','游客')
            comment.set('content',data)
            comment.set('dependent', playlist)
            return comment.save().then((newComment) => {
                let data = {}
                let {id,attributes} = newComment
                Object.assign(this.currentComment,{
                    id,
                    ...attributes
                })
            }, function (error) {
                console.error(error)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventsHub()
            this.model.fetch(this.model.playListId)
            this.bindeEvents()
        },
        bindeEvents(){
            this.view.$el.on('click','#submit-comment',(e)=>{
                let value = this.view.$el.find('.comment-input').text()
                this.model.setComment(value).then(()=>{
                    console.log(this.model.currentComment)
                    this.view.render(this.model.currentComment)
                })
            })
        },
        bindEventsHub(){
            window.eventHub.on('playListId',data =>{
                this.model.playListId = data
            })
        }
    }
    controller.init(view,model)
}