
function* infiniteSauce(sauce) {
    let i = 0;
    while (true) {
        yield sauce[i];
        i = (i + 1) % sauce.length;
    }
}

module.exports = {
    infiniteSauce
};
