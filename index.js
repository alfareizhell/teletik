const telebot = require('telebot')
const bot = new telebot(atob('NTY1NDMzMTQ2NTpBQUg2YUkzQ2dzZXdLT0JEYmR4Y0pJYmNZUmlfRFdwdHUyWQ=='))
const tiktod = require('tiktod')
const delay = require('delay')

const errmsg = 'ERROR TERDETEKSI, Silahkan cek kembali tautan yang anda kirim🙏'


try {
    function getUwak(h) {
        if (h >= 4 && h < 10) return "Selamat Pagi" ; if (h >= 10 && h < 15) return "Selamat Siang" ; if (h >= 15 && h < 18) return "Selamat Sore" ; if (h >= 18 || h < 4) return "Selamat Malam"
    }
    
bot.on('/start', msg => {
    h = new Date().getHours();
    msg.reply.text(`${getUwak(h)} kak ${msg.from.first_name}
    
Silahkan mengirim tautan video maupun foto dari TikTok dan kami akan mengirimkan file tersebut HD tanpa watermark kepada anda😁👀`, { asReply: true }).catch(console.log)
    console.log(msg)
});

bot.on('text', async (msg) => {
    const id = msg.chat.id
    const txt = msg.text

    function validate(str) {
        res = str.match(/^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/g)
        return (res !== null)
    }

    if (validate(txt)) {
     wait = await msg.reply.text('Mohon Tunggu Sebentar, Sedang mengirim media', { asReply: true });
    data = await tiktod.download(txt);
    if (data.status !== 200) return msg.reply.text(errmsg, { asReply: true })
        if (data.result.is_video) {
            bot.sendVideo(msg.chat.id, data.result.media, {caption: data.result.caption  || "No Caption"})
            .catch(console.error);
            bot.deleteMessage(wait.chat.id, wait.message_id);
        } else if (data.result.is_image) {
                let num = 0
                let ke = 0
                let media = [[]]
                function pm(ke, med, capt) {
                    return media[ke].push({"type":"photo","media": med, "caption": capt})
                }
            for (let i of data.result.media) {
                if (num == 10 || num == 20 || num == 30) {
                    ke++ 
                    media.push([])
                }

                if (num == 0) {
                    pm(ke, data.result.media[num], `${data.result.caption} [${ke+1}]`|| 'No Caption')
                } else if (num == 10 || num == 20 || num == 30) {
                    pm(ke, data.result.media[num], ` [${ke+1}]`|| 'No Caption')
                } else {
                    pm(ke, data.result.media[num], undefined)
                }
                   num ++
            };
            bot.deleteMessage(wait.chat.id, wait.message_id);
            for (let i of media) {
                await delay(1700);
                bot.sendMediaGroup(msg.chat.id, i).catch(console.error);
            }
            let title = data.result.music.title
            await delay(1000);
            bot.sendAudio(msg.chat.id, data.result.music.url, {caption: title, title: title, fileName: title}).catch(console.error);
        }
    }
})

} catch(e) {
    console.log(e)
}

bot.start();