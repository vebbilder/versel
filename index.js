const Discord = require('discord.js');
const config = require('./config.json');
const keepAlive = require('./server');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
const client = new Discord.Client(config.cfg);
const express = require('express');
const app = express();
var cheerio = require("cheerio");
const puppeteer = require('puppeteer-extra');

client.login(config.token);

client.on('ready', async(r) => {
    console.log('тестовое сообщение');
});

// JSON.stringify(parsedBody.text
client.on('messageCreate', async(message) => {
    if (message.content.startsWith("@") || message.content.substring(0, 2) === "@") {
        message.channel.sendTyping();
        void(async() => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

            await page.goto('https://yandex.ru/images/search?text=' + message.content.replace('??', '').trimStart() + '&itype=jpg');


            const html = await page.content();
            const $ = cheerio.load(html);
            const numIt = $('.serp-item__thumb').length;
            if (!numIt) {
                message.reply('Попалась битая ссылка! Или возможно достигнут лимит ао интервалу скачивания картинок, лучше минут через 5 попробуй!');
                return;
            }
            message.reply('https:' + $(`.serp-item__thumb:eq(${Math.floor(Math.random() * numIt)})`).attr(`src`));

            await browser.close();
        })()



        return;
    }
});


keepAlive();