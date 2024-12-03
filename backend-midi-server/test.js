import WebSocket from 'ws'


const PORT = 8080

const host = 'localhost'
const url = `ws://${host}:${PORT}`

console.log(`connecting to ${url}`)
const ws = new WebSocket(url)


ws.on('error', console.error)

ws.on('open', function open() {
    console.log('opened')
    ws.send('something')
})

ws.on('message', function message(data) {
    console.log('received', JSON.parse(data))
})
