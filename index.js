#!/usr/bin/env node

const ora = require("ora");
const https = require("https");
const fetch = require("node-fetch");
const termImg = require("term-img");
const cheerio = require("cheerio");

const agent = new https.Agent({
  rejectUnauthorized: false
});

(async () => {
  const args = process.argv.slice(2);

  const url = ["https://pokemon.alexonsager.net", ...args].join("/");

  const spinner = ora("Fusing Pokémon...").start();

  const html = await fetch(url, { agent }).then(res => res.text());
  const $ = cheerio.load(html);
  const pokemon = {
    name: $("#pk_name").text(),
    src: $("#pk_img").attr("src")
  };

  const image = await fetch(pokemon.src, { agent });
  const buffer = await image.buffer();

  spinner.stop();

  console.log(await termImg.string(buffer));
  console.log(pokemon.name);
})();
