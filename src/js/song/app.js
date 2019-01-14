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

console.log(id)