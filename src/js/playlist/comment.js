{
    let view = {
        el:'section.comments',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let $li = $(`
            <li>
                <div class="avtar">
                    <img  alt="">
                </div>
                <div class="comment-detail">
                    <div class="comment-name">${data.name}</div>
                    <div class="comment-content">
                        ${data.content}
                    </div>
                </div>
            </li>
            `)
            this.$el.find('ol#comments').prepend($li)
        },
        emptyInput(selector){
            this.$el.find(selector).val('')
        },
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
                    this.view.emptyInput('#submit-comment')
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