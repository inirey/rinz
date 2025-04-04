if (process.argv.includes('--server')) require('./server')
require('dotenv').config(), require('rootpath')(), console.clear()
const { spawn: spawn } = require('child_process'), path = require('path'), CFonts = require('cfonts')

process.on('uncaughtException', error => {
   console.error('Uncaught Exception:', error.stack || error)
})
process.on('unhandledRejection', (reason, promise) => {
   console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

function start() {
   let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)]
   let p = spawn(process.argv[0], args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
   }).on('message', data => {
      try {
         if (data === 'reset') {
            console.log('Restarting...')
            p.kill()
         }
      } catch (err) {
         console.error('Error handling message:', err)
      }
   }).on('exit', code => {
      console.error('Exited with code:', code)
      if (code !== 0) {
         console.log('Restarting process due to non-zero exit code...')
         start()
      }
   }).on('error', err => {
      console.error('Spawn error:', err)
   })
}

CFonts.say('RINZ AI', {
   font: 'tiny',
   align: 'center',
   colors: ['green']
}), CFonts.say('Memulai ai.....harap tunggu', {
   colors: ['red'],
   font: 'console',
   align: 'center'
}), start()