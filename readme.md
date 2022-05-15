## ⚠️ Before run
Rename .env file and add: BOT_ID, BOT_KEY, CHAT_NAME.  

## 🤖 Bot commands

### Bot launch
The bot must be a **Chat Admin** with the rights: 
- **Change Group Info**  
*For update chat icon*
- **Delete message**  
*For clean up after bot commands and icon update*  

The bot will then be launched after any event or chat message.

### Update icon by hand
Send 'up' message to chat for immediately update the chat icon.
The message will be removed by bot.

## 🧰 Issues 
### Github issues
(already have in .env file)

NTBA_FIX_319 = true  
→ https://github.com/yagop/node-telegram-bot-api/issues/319

NTBA_FIX_350 = true  
→ https://github.com/yagop/node-telegram-bot-api/issues/350

### Fix puppeteer-chrome issues on Unix machine
Install this library's:

**Ubuntu**  
https://github.com/puppeteer/puppeteer/issues/1837#issuecomment-757650566
```
sudo apt-get install ca-certificates \
fonts-liberation \
libappindicator3-1 \
libasound2 \
libatk-bridge2.0-0 \
libatk1.0-0 \
libc6 \
libcairo2 \
libcups2 \
libdbus-1-3 \
libexpat1 \
libfontconfig1 \
libgbm1 \
libgcc1 \
libglib2.0-0 \
libgtk-3-0 \
libnspr4 \
libnss3 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libstdc++6 \
libx11-6 \
libx11-xcb1 \
libxcb1 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxrandr2 \
libxrender1 \
libxss1 \
libxtst6 \
lsb-release \
wget \
xdg-utils
```

**Linux**  
https://github.com/puppeteer/puppeteer/issues/391#issuecomment-666541972
```
yum install -y alsa-lib.x86_64 \
atk.x86_64 \
cups-libs.x86_64 \
gtk3.x86_64 \
ipa-gothic-fonts \
libXcomposite.x86_64 \
libXcursor.x86_64 \
libXdamage.x86_64 \
libXext.x86_64 \
libXi.x86_64 \
libXrandr.x86_64 \
libXScrnSaver.x86_64 \
libXtst.x86_64 \
pango.x86_64 \
xorg-x11-fonts-100dpi \
xorg-x11-fonts-75dpi \
xorg-x11-fonts-cyrillic \
xorg-x11-fonts-misc \
xorg-x11-fonts-Type1 \
xorg-x11-utils
yum update nss -y
```