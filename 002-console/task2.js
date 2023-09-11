#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const result = randomInteger(0, 100);

rl.write('Загадано число в диапазоне от 0 до 100\n');

rl.on('line', data => {
  const answer = parseInt(data, 10);
  if (answer > result) {
    console.log('Меньше');  
  } else if (answer < result) {
    console.log('Больше');  
  } else if (answer === result) {
    console.log(`Верно! Загаданное число: ${result}`);
    rl.close();
  }
});
