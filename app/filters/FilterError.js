var errorConstructor = function FilterError(m) {
    this.message = m;
    this.type= "FilterError";
}

module.exports = errorConstructor;