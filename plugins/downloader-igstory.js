let handler = async (m, {
   usedPrefix,
   command,
   args
}) => {
   if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'bulansutena'))
   m.react('🕐')
   let old = new Date()
   try {
      const json = await Func.fetchJson(API('alya', '/api/igs', {
         q: args[0]
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      for (let v of json.data) {
         conn.sendMedia(m.chat, v.url, m, {
            caption: `• *Fetching* : ${((new Date - old) * 1)} ms`
         })
      }
   } catch (e) {
      console.log(e)
      return m.reply(status.error)
   }
}
handler.help = ['igs']
handler.tags = ['downloader']
handler.command = ['igs', 'igstory']
handler.limit = 1
module.exports = handler