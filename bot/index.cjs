require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const nodeHtmlToImage = require('node-html-to-image')
const font2base64 = require('node-font2base64')
const { DateTime } = require("luxon");


const { BOT_ID, BOT_KEY, CHAT_NAME } = process.env
const TOKEN = BOT_ID + ':' + BOT_KEY;
const TIMEZONE = 'Europe/Kiev';
const INIT_HOUR = 4;

let chatID = null;
let userID = null;
let msgID = null;
let isWatching = false;

// Create a bot that uses 'polling' to fetch new updates
const bot = BOT_ID && BOT_KEY ? new TelegramBot(TOKEN, {polling: true, cancellation: true}) : undefined;

if( BOT_ID && BOT_KEY && CHAT_NAME ){
  runBot()
} else {
  console.log(`🤖 Can't find env params:`)
  if(!BOT_ID) console.log('BOT_ID')
  if(!BOT_KEY) console.log('BOT_KEY')
  if(!CHAT_NAME) console.log('CHAT_NAME')
}

function runBot(){
  // Run watcher
  bot.on('message', async (msg) => {
    // Work only in target chat
    if(msg?.chat?.username !== CHAT_NAME) return

    chatID = msg?.chat?.id
    userID = msg?.from?.id
    msgID = msg?.message_id

    if(!isWatching) initWatcher()

    // Delete all message from bot in target chat
    if(msg.from.id == BOT_ID) delMsg()


    // ==================================
    // ========== Secure level ==========
    // ==================================

    if(!await checkAccess(chatID, userID)) return

    if(msg.text?.toLowerCase() === 'up'){
      delMsg()
      updateChatIcon()
    }
  })

  // Catch errors
  bot.on('polling_error', error => {
    console.log(error);
  });
}

function delMsg(){
  bot.deleteMessage(chatID, msgID)
}

function dateStamp(){
  return DateTime.local({zone: TIMEZONE}).toLocaleString(DateTime.DATETIME_MED)
}


async function initWatcher() {
  if(!checkAccess(chatID)) return

  isWatching = true
  console.log(dateStamp())
  console.log('Bot have access and running 🚀')


  setTimeout(function process() {
    if(!checkAccess(chatID)) {
      isWatching = false
      console.log(dateStamp())
      console.log('⚠️ Access was restricted')
      console.log('⚠️ Bot is stopped')
      return
    }
    updateChatIcon()
    setTimeout(process, getRunCountdown());
  }, getRunCountdown());
}


function checkAccess(chatID, userID) {
  return new Promise(resolve => {
    bot.getChatAdministrators(chatID)
    .then(r => {
      for (i in r) {
        if(userID && r[i].user.id == userID) {
          let accept = r[i].status == 'creator' || r[i].can_change_info
          if(!accept ) console.log(`${userID} can't change info`)
          resolve(accept);
        }
        if(!userID && r[i].user.id == BOT_ID) {
          if(!r[i].can_change_info) console.log("Need access to change info")
          if(!r[i].can_delete_messages) console.log("Need access to delete msg")
          resolve(r[i].can_change_info && r[i].can_delete_messages);
        }
      }
      resolve(false);
    })
  })
}



function getRunCountdown(){
  const date = DateTime.local({zone: TIMEZONE});

  // If time for change the icon has expired
  // schedule task for next day
  // 1 msec need for the right next 24 hours calculation
  if(date.hour >= INIT_HOUR){
    let initDate = date
      .plus({ days: 1 })
      .set({ hours:INIT_HOUR, minutes:0, seconds:0, milliseconds:001 });
    return initDate.diff(date).milliseconds;

  } else {
    let initDate = date
      .set({ hours:INIT_HOUR, minutes:0, seconds:0, milliseconds:001 });
    return initDate.diff(date).milliseconds;
  }
}


async function updateChatIcon(){
  console.log(dateStamp())
  console.log('Generate new icon 💫')

  try {
    let imgBuffer = await nodeHtmlToImage({html: getTemplate()});
    let options = {
      filename: 'icon',
      contentType:'image/png'
    };
    console.log('Set new icon 🎉')
    bot.setChatPhoto(chatID, imgBuffer, {}, options)

  } catch (err) {
    console.log(err)
    if( err.toString().toLowerCase().includes('error while loading shared libraries')){
      console.log(`
      See how to fix it

      Ubuntu
      https://github.com/puppeteer/puppeteer/issues/1837#issuecomment-757650566

      Linux
      https://github.com/puppeteer/puppeteer/issues/391#issuecomment-666541972
      `)
    }
  }
}


function getTemplate(){
  // Calc days diff
  const date = DateTime.local({zone: TIMEZONE});
  const invasion = date.set({
    year: 2022,
    month: 2,
    day: 24,
    hour: 4,
    minute: 0,
    second: 0,
    millisecond: 0
  });

  const days = Math.ceil(date.diff(invasion, 'days').days);


  // Get font
  const fontData =  font2base64.encodeToDataUrlSync('bot/Golos-Text_Regular.woff2')

  // get image
  const image = fs.readFileSync('bot/bg.png');
  const base64Image = new Buffer.from(image).toString('base64');
  const dataURI = 'data:image/jpeg;base64,' + base64Image

  let template = `
    <html>
    <head>
      <style>
        @font-face {
          font-family: 'GolosTextWebRegular';
          src:
            url('${fontData}') format('woff2');
          font-weight: normal;
          font-style: normal;
        }

        body {
          width: 640px;
          height: 640px;
          background-image: url(${dataURI});
          background-repeat: no-repeat;
          color: #BCBCBC;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0;
          margin: 0;
        }

        h1 {
          font-family: 'GolosTextWebRegular';
          font-size: 207.366px;
          line-height: 143px;
          padding-bottom: 4px;
          padding-top: 28px;
        }

        span {
          font-family: 'GolosTextWebRegular';
          font-size: 95.7883px;
          line-height: 112px;
        }

        h1,
        span {
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <h1>${days}</h1>
      <span>${numDeclension(days)}</span>
    </body>
    </html>`;

  return template
}



// Declination of numeric signatures
function numDeclension(number) {
  let sign = ['день', 'дня', 'дней'];
  let cases = [2, 0, 1, 1, 1, 2];
  return sign[
    ( number % 100 > 4 && number % 100 < 20 )
      ? 2
      : cases [ ( number % 10 < 5 )
        ? number % 10
        : 5 ]
  ];
}
