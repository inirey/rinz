const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m, {
   conn,
   users
}) {
   let id = m.chat
   conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}
   if (m.quoted && /leka untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
      if (!(id in conn.lengkapikalimat) && /leka untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == conn.lengkapikalimat[id][0].id) {
         if (['Timeout', ''].includes(m.text)) return !0
         let json = JSON.parse(JSON.stringify(conn.lengkapikalimat[id][1]))
         if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            await m.reply(`*Benar*, *+ ${Func.formatNumber(conn.lengkapikalimat[id][2])} Exp*`).then(() => {
               users.exp += conn.lengkapikalimat[id][2]
               clearTimeout(conn.lengkapikalimat[id][3])
               delete conn.lengkapikalimat[id]
            })
         } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
         else m.reply(`*Salah!*`)
      }
   }
   return !0
}
handler.exp = 0
module.exports = handler