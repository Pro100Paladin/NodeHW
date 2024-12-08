require('colors');

const calculateResultSum = require("./calc.js");

const total = calculateResultSum([12.1, 2.2, 43.1], 0.9);

const text = "Общая стоимость: " + total + " рублей";
console.log(total > 50 ? text.red : text.green);