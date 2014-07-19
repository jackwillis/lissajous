// Adapted from <http://www.bennadel.com/blog/2308-creating-a-fixed-length-queue-in-javascript-using-arrays.htm>

function FixedQueue(fixedSize, initialValues) {

    // If there are no initial values given, default to empty array
    var queue = (initialValues || []);

    // Store fixedSize in queue for access in methods
    queue.fixedSize = fixedSize;

    // Extend queue with FixedQueue's methods
    for (var prop in FixedQueue.prototype) {
        queue[prop] = FixedQueue.prototype[prop];
    }

    // Trim any initial excess from the queue and return it.
    queue.trimTail();
    return queue;
}

// Trim the queue down to the appropriate size, removing items from the beginning.
FixedQueue.prototype.trimHead = function () {

    // Return if no trimming needs to be performed.
    if (this.length <= this.fixedSize) return;

    // Trim whatever is beyond the fixed size.
    Array.prototype.splice.call(this,
                                0,
                                (this.length - this.fixedSize));

};

// The same as above, but taking excess away from the end.
FixedQueue.prototype.trimTail = function () {

    if (this.length <= this.fixedSize) return;

    Array.prototype.splice.call(this,
                                this.fixedSize,
                                (this.length - this.fixedSize));
};

var wrapMethod = function (method, trimMethod) {
    return function () {
        // Call the native method.
        method.apply(this, arguments);

        // Trim the queue so it stays the proper length.
        trimMethod.call(this);

        return this;
    };
};

FixedQueue.prototype.push    = wrapMethod(Array.prototype.push,    FixedQueue.prototype.trimHead);
FixedQueue.prototype.splice  = wrapMethod(Array.prototype.splice,  FixedQueue.prototype.trimTail);
FixedQueue.prototype.unshift = wrapMethod(Array.prototype.unshift, FixedQueue.prototype.trimTail);