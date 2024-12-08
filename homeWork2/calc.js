const NP = require('number-precision');

function calculateResultSum(pur, discount) {
    let total = pur.reduce((acc, pur) => NP.plus(acc, pur) += pur, 0);

    total = NP.times(total + discount);
    return total;
}
module.exports = calculateResultSum()