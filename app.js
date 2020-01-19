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
        if (moviesArray.length === 0) return ctx.reply('lack of movies faggot!')
        const mapUsers = new Set(moviesArray.map(el => el.userId));
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
                                                                }); // write it back
        //message.from.id
      }
  });

})

bot.on('text', async (ctx) => {
  const message = ctx.message;
  if (!message.text.match(/\w/g)) return ctx.reply('in english faggot!');
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
                                                          }); // write it back
    return ctx.reply('movie added')
  });
})


bot.launch()
