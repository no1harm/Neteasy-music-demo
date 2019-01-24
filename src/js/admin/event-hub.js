window.eventHub = {
    events:{},
    emit(eventName,data){
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    on(eventName,fn){
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    },
    off(){}
}
window.parseUrl = {
    getId(){
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
    },
}