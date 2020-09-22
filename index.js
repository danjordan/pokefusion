#!/usr/bin/env node

const ora = require("ora");
const fetch = require("node-fetch");
const termImg = require("term-img");
const cheerio = require("cheerio");

(async () => {
  try {
    const args = process.argv.slice(2);

    const url = ["https://pokemon.alexonsager.net", ...args].join("/");

    const spinner = ora("Fusing Pokémon...").start();

    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);

    const pokemon = {
      name: $("#pk_name").text(),
      src: $("#pk_img").attr("src"),
    };

    const image = await fetch(pokemon.src);
    const buffer = await image.buffer();

    spinner.stop();

    console.log(await termImg(buffer));
    console.log(pokemon.name);
  } catch (e) {
    console.log(`An error occurred. ${e.message}`);
  }
})();
