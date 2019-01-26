{
    let view = {
        el:'section.comments',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            if(data.length === 0){
                this.$el.find('ol#comments').prepend($(`
                    <span class="no-comment">此歌单暂时没有评论，快来成为沙发！</span>
                `))
            }
            data.map((comment)=>{
                let $li = this.createLi(comment)
                this.$el.find('ol#comments').prepend($li)
            })
        },
        addComment(data){
            let $li = this.createLi(data)
            this.$el.find('ol#comments').prepend($li)
            if(this.$el.find('.no-comment')){
                this.$el.find('.no-comment').remove()
            }
        },
        createLi(data){
            return $(`
            <li data-comment-id="${data.id}">
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
        },
        emptyInput(selector){
            this.$el.find(selector).empty()
        },
    }
    let model = {
        playListId:'',
        comments:[],
        currentComment:{},
        fetch(data){
            var playlist = AV.Object.createWithoutData('Playlist', data)
            var query = new AV.Query('Comments')
            query.equalTo('dependent', playlist)
            return query.find().then( (comments) => {
                comments.map((comment)=>{
                    let data = {}
                    data.id = comment.id
                    Object.assign(data,comment.attributes)
                    this.comments.push(data)
                })
            })
        },
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
            this.model.playListId = this.getPlayListId()
            this.model.fetch(this.model.playListId).then(()=>{
                this.view.render(this.model.comments)
            })
            this.bindeEvents()
        },
        bindeEvents(){
            this.view.$el.on('click','#submit-comment',(e)=>{
                let value = this.view.$el.find('.comment-input').text()
                if(!value){
                    alert('请输入有效字符')
                }else{
                    let filterValue = value.replace(/[<^|]+/,'&lt;').replace(/[>^|]+/,'&gt;').replace(/[<^|]+/,'&lt;')
                    this.model.setComment(filterValue).then(()=>{
                        this.view.addComment(this.model.currentComment)
                        alert('已成功添加评论')
                        this.view.emptyInput('.comment-input')
                    })
                }
            })
        },
        bindEventsHub(){
            window.eventHub.on('playListId',data =>{
                this.model.playListId = data
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