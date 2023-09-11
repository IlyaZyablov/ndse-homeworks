#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { argv } = yargs(hideBin(process.argv))
  .option('year', {
    alias: 'y',
    type: 'boolean',
    description: 'год',
  })
  .option('month', {
    alias: 'm',
    type: 'boolean',
    description: 'месяц',
  })
  .option('date', {
    alias: 'd',
    type: 'boolean',
    description: 'дата в календарном месяце',
  });

function parseTime(object) {
  const action = object['_'][0];

  let current;
  let changeFunc;
  if (Object.prototype.hasOwnProperty.call(object, 'y')) {
    current = new Date().getFullYear();
    changeFunc = (type, value) => type
      ? new Date(new Date().setFullYear(current + value)).getFullYear()
      : new Date(new Date().setFullYear(current - value)).getFullYear();
  } else if (Object.prototype.hasOwnProperty.call(object, 'm')) {
    current = new Date().getMonth() + 1;
    changeFunc = (type, value) => type
      ? new Date(new Date().setMonth(current + value)).getMonth()
      : new Date(new Date().setMonth(current - value)).getMonth();
  } else if (Object.prototype.hasOwnProperty.call(object, 'd')) {
    current = new Date().getDate();
    changeFunc = (type, value) => type
      ? new Date(new Date().setDate(current + value)).getDate()
      : new Date(new Date().setDate(current - value)).getDate();
  } else {
    current = new Date().toISOString();
  }

  if (action === 'current') {
    return current;
  }

  const changeDateOpt = object['_'][1];

  if (!changeDateOpt) {
    return 'Неправильные аргументы!';
  }
  
  if (action === 'add') {
    return changeFunc(true, changeDateOpt);
  } else if (action === 'sub') {
    return changeFunc(false, changeDateOpt);
  }

  return 'Неправильные аргументы!';
}

const result = parseTime(argv);
console.log(result);
