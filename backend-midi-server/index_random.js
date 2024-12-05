import { WebMidi } from 'webmidi'
import WebSocket, { WebSocketServer } from 'ws'
import ip from 'ip'

const PORT = 8080


function main () {
  console.log(`running at ${ip.address()}:${PORT}`)
  console.log('starting up, enabling MIDI')

  const wss = new WebSocketServer({
    port: PORT
  })

  let sockets = []
  wss.on('connection', (ws, req) => {
    sockets.push(ws)
    const ip = req.socket.remoteAddress
    console.log(`new connection, now ${sockets.length} connections, ip: ${ip}`)

    ws.on('error', console.error)

    ws.on('message', (msg) => {
      console.log('got message')
    })

    ws.on('close', () => {
      sockets = sockets.filter(s => s !== ws)
      console.log(`connection closed, now ${sockets.length} connections`)
    })
  })


  /**
   * Sends MIDI message to WebSocket clients
   * @param {object} msg
   */
  const midiMessage = (msg) => {
    console.log('midi', msg.type, msg.note.number)

    const note = {
      type: msg.type,
      time: msg.timestamp,
      number: msg.note.number,
      velocity: msg.velocity,
      channel: msg.message.channel,
    }

    wss.clients.forEach(function each (client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(note))
      }
    })
  }

  const sendRandomMidi = () => {
    const time = performance.now()
    const duration = Math.random()
    const note = {
      type: 'noteon',
      message: {
        type: 'noteon',
        channel: Math.floor(Math.random() * 6)
      },
      note: {
        number: Math.round(Math.random() * 40) + 40
      },
      time,
      velocity: Math.random()
    }
    // send note
    midiMessage(note)
    // send noteoff
    const noteoff = {
      ...note,
      type: 'noteoff',
      message: {
        ...note.message,
        type: 'noteoff'
      },
      time: time + duration * 1000
    }
    setTimeout(() => midiMessage(noteoff), duration * 1000)
    // send next note
    setTimeout(sendRandomMidi, Math.random() * 1000)

  }

  /**
   * Set all required MIDI listeners
   */
  const onMidiEnabled = () => {
    if (WebMidi.inputs.length < 1) {
      console.warn('No MIDI device detected')
    } else {
      WebMidi.inputs.forEach((input, index) => {
        input.removeListener()
        input.addListener('noteon', midiMessage)
        input.addListener('noteoff', midiMessage)
        // input.addListener('controlchange', controlChange);
        // input.addListener('pitchbend', pitchBend);
        // input.addListener('midimessage', midiMessage)
        console.log(`MIDI enabled for ${input.name}`)
      })
    }
    setTimeout(sendRandomMidi, 500)
  }

  // enable Web Midi
  WebMidi.enable()
    .then(onMidiEnabled)
    .catch((err) => {
      console.log(err)
    })
}

main()
