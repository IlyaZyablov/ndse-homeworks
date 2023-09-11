#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const { argv } = yargs(hideBin(process.argv));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function writeLog(file, data) {
  fs.readFile(file, 'utf-8', (err, result) => {
    if (err) {
      fs.writeFile(file, JSON.stringify([{ id: 1, result: data }]), err => {
        if (err) {
          throw new Error(err);
        }
      });
      return;
    }

    parsedResult = JSON.parse(result);

    parsedResult.push({ id: parsedResult.length + 1, result: data });

    fs.writeFile(file, JSON.stringify(parsedResult), err => {
      if (err) {
        throw new Error(err);
      }
    });
  });
}

const logFile = path.join(__dirname, argv['_'].length > 0 ? `${argv['_']}.txt` : 'game-log.txt');
const result = randomInteger(1, 2);

rl.write('Загадана цифра 1 или 2. Угадайте её:\n');

rl.on('line', data => {
  const answer = parseInt(data, 10);
  if (answer === result) {
    console.log('Вы выиграли!');
    writeLog(logFile, 'win');
  } else {
    console.log('Вы проиграли!');
    writeLog(logFile, 'lose');
  }
  rl.close();
});