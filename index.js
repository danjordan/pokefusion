#!/usr/bin/env node

const ora = require("ora");
const https = require("https");
const fetch = require("node-fetch");
const termImg = require("term-img");
const puppeteer = require("puppeteer");

const agent = new https.Agent({
  rejectUnauthorized: false
});

(async () => {
  const args = process.argv.slice(2);

  const url = ["https://pokemon.alexonsager.net", ...args].join("/");

  const spinner = ora("Fusing Pokémon...").start();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const pokemon = await page.evaluate(() => {
    const name = document.querySelector(".title span").textContent;
    const src = document.querySelector("#pk_img").src;

    return { name, src };
  });

  await browser.close();

  const image = await fetch(pokemon.src, { agent });
  const buffer = await image.buffer();

  spinner.stop();

  console.log(await termImg.string(buffer));
  console.log(pokemon.name);
})();
