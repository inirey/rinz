let handler = m => m
handler.before = async function (m) {
   let id = m.chat
   this.math = this.math ? this.math : {}
   if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
   if (!m.quoted || m.quoted.sender != this.user.jid || !/^Berapa hasil dari/i.test(m.quoted.text)) return !0
   if (!(id in this.math)) return m.reply('Soal itu telah berakhir')
   if (m.quoted.id == this.math[id][0].id) {
      let math = JSON.parse(JSON.stringify(this.math[id][1]))
      if (m.text == math.result) {
         global.db.data.users[m.sender].exp += math.bonus
         clearTimeout(this.math[id][3])
         delete this.math[id]
         m.reply(`*Benar!*\n+${math.bonus} Exp`)
      } else {
         if (--this.math[id][2] == 0) {
            clearTimeout(this.math[id][3])
            delete this.math[id]
            m.reply(`*Kesempatan habis!*\nJawaban: *${math.result}*`)
         } else m.reply(`*Jawaban Salah!*\nMasih ada ${this.math[id][2]} kesempatan`)
      }
   }
   return !0
}
module.exports = handler