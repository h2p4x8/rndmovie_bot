const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const fs = require('fs')
const fetch = require("node-fetch");

const bot = new Telegraf('812788041:AAFCpftJNJfdOpFiTcvFzdnB6nAh7WOB1y4')

bot.command('random', async (ctx) => {
  const moviesArray = await fs.readFile('movies.json', 'utf8', function readFileCallback(err, data){
      if (err){
        console.log(err)
        return ctx.reply('lack of movies faggot!!')
      } else {
        const moviesArray = JSON.parse(data).table;
        console.log(moviesArray)
        if (moviesArray.length === 0) return ctx.reply('lack of movies faggot!')
        const mapUsers = new Set(moviesArray.map(el => el.userId));
        console.log(mapUsers);
        const preFinalArray = [];
        mapUsers.forEach(el => {
           const arr = moviesArray.filter(movie => movie.userId === el);
           preFinalArray.push(arr[Math.floor(Math.random()*arr.length)]);
        })

        const finalMovie = preFinalArray[Math.floor(Math.random()*preFinalArray.length)];
        if (finalMovie.poster !== 'N/A') {
          ctx.replyWithPhoto(
              finalMovie.poster,
              Extra.caption(`${finalMovie.title} (${finalMovie.year}) - ${finalMovie.runtime}`).markdown())
        } else {
          ctx.reply(`${finalMovie.title} (${finalMovie.year}) - ${finalMovie.runtime}`)
        }

        moviesArray.splice(moviesArray.findIndex(el => el.imdbId === finalMovie.imdbId), 1)
        const obj = {
          table: moviesArray
        }
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('movies.json', json, 'utf8', function(err) {
                                                                if (err) throw err;
                                                                      console.log('complete');
                                                                }); // write it back
        //message.from.id
      }
  });

})

bot.on('text', async (ctx) => {
  const message = ctx.message;
  if (message.text.match(/imdb/g)&&message.text.match(/title/g)) {
    var ombdRes = await fetch(`http://www.omdbapi.com/?i=${message.text.match(/tt\d{4,}/)}&apikey=f042cb95`)
                          .then(res => res.json())
                          .catch(err => console.log(err))
    if (ombdRes.Error) return ctx.reply('imdb faggot!');
  }
  else {
    var ombdRes = await fetch(`http://www.omdbapi.com/?t=${message.text.replace(' ', '+')}&apikey=f042cb95`)
                          .then(res => res.json())
                          .catch(err => console.log(err))
    if (ombdRes.Error) return ctx.reply('no such title faggot!');
    // http://www.omdbapi.com/?t=The+Turkey+Bowl
  }
  await fs.readFile('movies.json', 'utf8', function readFileCallback(err, data){
      if (!err){
        var obj = JSON.parse(data); //now it an object
        if (obj.table.find(el => el.imdbId === ombdRes.imdbID)) return ctx.reply('multiple faggot!');
      } else {
        var obj = { table: [] }
      }
      const movie = {
        userId: message.from.id,
        imdbId: ombdRes.imdbID,
        title: ombdRes.Title,
        year: ombdRes.Year,
        poster: ombdRes.Poster,
        runtime: ombdRes.Runtime
      }
      obj.table.push(movie);
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('movies.json', json, 'utf8', function(err) {
                                                            if (err) throw err;
                                                            console.log('complete');
                                                          }); // write it back
    return ctx.reply('movie added')
  });
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
