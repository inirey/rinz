let handler = m => m
let debugMode = !1

let winScore = 50000
let playScore = 20000

handler.before = async function (m) {
   let ok
   let isWin = !1
   let isTie = !1
   let isSurrender = !1
   this.game = this.game ? this.game : {}
   let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
   if (room) {
      // m.reply(`[DEBUG]\n${parseInt(m.text)}`)
      if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text))
         return !0
      isSurrender = !/^[1-9]$/.test(m.text)
      if (m.sender !== room.game.currentTurn) { // nek wayahku
         if (!isSurrender)
            return !0
      }
      if (debugMode)
         m.reply('[DEBUG]\n' + require('util').format({
            isSurrender,
            text: m.text
         }))
      if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
         m.reply({
            '-3': 'Game telah berakhir',
            '-2': 'Invalid',
            '-1': 'Posisi Invalid',
            0: 'Posisi Invalid',
         }[ok])
         return !0
      }
      if (m.sender === room.game.winner)
         isWin = true
      else if (room.game.board === 511)
         isTie = true
      let arr = room.game.render().map(v => {
         return {
            X: '✖',
            O: '⭕',
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
         }[v]
      })
      if (isSurrender) {
         room.game._currentTurn = m.sender === room.game.playerX
         isWin = true
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner
      let str = `
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
${isWin ? `@${winner.split('@')[0]} Selamat Anda Menang!🎉 Mendapatkan (+${winScore} 💵 Money)` : isTie ? `Game telah berakhir! Kalian seri (+${playScore} 💵 Money)` : `Sekarang Giliran Anda ${['✖', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}
❏ *PEMAIN 1* ✖: @${room.game.playerX.split('@')[0]}
❏ *PEMAIN 2* ⭕: @${room.game.playerO.split('@')[0]}
Ketik *nyerah* untuk nyerah
Room ID: ${room.id}
`.trim()
      let users = db.data.users
      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
         room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
      const btn = isTie ? ['TicTacToe', '/ttt'] : ['Nyerah', 'nyerah']
      if (room.x !== room.o)
         await this.reply(room.x, str, m, {
            mentions: this.parseMention(str)
         })
      await this.reply(room.o, str, m, {
         mentions: this.parseMention(str)
      })
      if (isTie || isWin) {
         users[room.game.playerX].money += playScore
         users[room.game.playerO].money += playScore
         if (isWin)
            users[winner].money += winScore - playScore
         if (debugMode)
            m.reply('[DEBUG]\n' + format(room))
         delete this.game[room.id]
      }
   }
   return !0
}

module.exports = handler