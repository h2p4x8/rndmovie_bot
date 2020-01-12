const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const fs = require('fs')
const fetch = require("node-fetch");
const movies = require('./movies')

const AnimationUrl1 = 'https://media.giphy.com/media/ya4eevXU490Iw/giphy.gif'
const AnimationUrl2 = 'https://media.giphy.com/media/LrmU6jXIjwziE/giphy.gif'

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.on('text', async (ctx) => {
  const message = ctx.message;
  if (message.text.match(/imdb/g)&&message.text.match(/title/g)) {
    const ombdRes = await fetch(`http://www.omdbapi.com/?i=${message.text.match(/tt\d{4,}/)}&apikey=f042cb95`)
                          .then(res => res.json())
                          .catch(err => console.log(err))
    const movie = {
      userId: message.from.id,
      imdbId: ombdRes.imdbID,
      title: ombdRes.Title,
      year: ombdRes.Year,
      poster: ombdRes.Poster,
      runtime: ombdRes.Runtime
    }
    movies.push(movie)
    console.log(movies)
    return ctx.reply('успех!')
  }
  return ctx.reply('ti pidor!')
})

// bot.command('add')

// bot.command('local', (ctx) => ctx.replyWithPhoto({ source: '/cats/cat1.jpeg' }))
// bot.command('stream', (ctx) => ctx.replyWithPhoto({ source: fs.createReadStream('/cats/cat2.jpeg') }))
// bot.command('buffer', (ctx) => ctx.replyWithPhoto({ source: fs.readFileSync('/cats/cat3.jpeg') }))
// bot.command('pipe', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }))
// bot.command('url', (ctx) => ctx.replyWithPhoto('https://picsum.photos/200/300/?random'))
// bot.command('animation', (ctx) => ctx.replyWithAnimation(AnimationUrl1))
// bot.command('pipe_animation', (ctx) => ctx.replyWithAnimation({ url: AnimationUrl1 }))
//
// bot.command('caption', (ctx) => {
//   console.log(ctx.message)
//     return ctx.replyWithPhoto(
//     'https://picsum.photos/200/300/?random',
//     Extra.caption(`Text ${ctx.message.text.replace('/caption', '')}`).markdown())
//   }
// )
//
// bot.command('album', (ctx) => {
//   ctx.replyWithMediaGroup([
//     // {
//     //   media: 'AgADBAADXME4GxQXZAc6zcjjVhXkE9FAuxkABAIQ3xv265UJKGYEAAEC',
//     //   caption: 'From file_id',
//     //   type: 'photo'
//     // },
//     {
//       media: 'https://picsum.photos/200/500/',
//       caption: 'From URL',
//       type: 'photo'
//     },
//     {
//       media: { url: 'https://picsum.photos/200/300/?random' },
//       caption: 'Piped from URL',
//       type: 'photo'
//     },
//     // {
//     //   media: { source: '/cats/cat1.jpeg' },
//     //   caption: 'From file',
//     //   type: 'photo'
//     // },
//     // {
//     //   media: { source: fs.createReadStream('/cats/cat2.jpeg') },
//     //   caption: 'From stream',
//     //   type: 'photo'
//     // },
//     // {
//     //   media: { source: fs.readFileSync('/cats/cat3.jpeg') },
//     //   caption: 'From buffer',
//     //   type: 'photo'
//     // }
//   ])
// })
//
// bot.command('edit_media', (ctx) => ctx.replyWithAnimation(AnimationUrl1, Extra.markup((m) =>
//   m.inlineKeyboard([
//     m.callbackButton('Change media', 'swap_media')
//   ])
// )))
//
// bot.action('swap_media', (ctx) => ctx.editMessageMedia({
//   type: 'animation',
//   media: AnimationUrl2
// }))

bot.launch()
