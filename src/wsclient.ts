import WebSocket from 'ws';

const wsc = new WebSocket('ws://localhost:8080', {
  perMessageDeflate: false
});

wsc.on('error', (err) => {
    console.error(err);
})

wsc.on('open', () => {
    wsc.send(JSON.stringify({
        timeout: '1000',
    }))
})

wsc.on('message', (data: JSON) => {
    console.log(JSON.parse(data.toString()));
})