const coinPlay = () => {
    return Math.floor(Math.random() * 2) === 0 ? "Орел" : "Решка";
};

module.exports.coinPlay = coinPlay;