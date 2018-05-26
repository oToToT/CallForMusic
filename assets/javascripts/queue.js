var Queue = function(arrayType = Array) {
    this.data = new arrayType(1);
    this.length = 0;
    this.lowpos_ = 0;
    this.highpos_ = 0;
    this.constructor_ = arrayType;
    // [lowpos_, highpos_)
};
Queue.prototype.front = function(x) {
    if (typeof(x) !== 'undefined') this.data[this.lowpos_] = x;
    return this.data[this.lowpos_];
};
Queue.prototype.back = function(x) {
    if (typeof(x) !== 'undefined') this.data[(this.highpos_ - 1 + this.data.length) % this.data.length] = x;
    return this.data[this.highpos_];
};
Queue.prototype.push = function(x) {
    console.assert(typeof(x) !== 'undefined', 'you must push something!');
    if (this.length === this.data.length) {
        let tmp = new this.constructor_(this.data.length << 1);
        for (let i = 0; i < this.data.length; i++) {
            tmp[i] = this.data[i];
        }
        this.data = tmp;
    }
    this.length++;
    this.data[(this.highpos_ + 1) % this.data.length] = x;
    this.highpos_ = (this.highpos_ + 1) % this.data.length;
};
Queue.prototype.pop = function() {
    console.assert(this.length > 0, 'nothing inside the queue.');
    this.length--;
    this.lowpos_ = (this.lowpos_ + 1) % this.data.length;
    if (this.length << 2 === this.data.length) {
        let tmp = new this.constructor_(this.data.length >> 1);
        for (let i = 0; i < this.length; i++) {
            tmp[i] = this.data[(i + this.lowpos_) % this.data.length];
        }
        this.data = tmp;
        this.lowpos_ = 0;
        this.highpos_ = this.length - 1;
    }
};
Queue.prototype.toArray = function() {
    let ret = new this.constructor_();
    for (let i = 0; i < this.length; i++) {
        ret[i] = this.data[(i + this.lowpos_) % this.data.length];
    }
    return ret;
};