qsa = document.querySelectorAll
qs = function(selector){
    return document.querySelector(selector);
    }


Class = function(obj){
    var objPrototype = obj.proto || Object.prototype;
    var objExtends = obj.extends || Object;
    obj.prototype = Object.create(objExtends.prototype, objPrototype);
    obj.create = function(){
        var objToReturn = obj.constructor.apply(null, arguments);
        Object.setPrototypeOf(objToReturn, obj.prototype);
        return objToReturn;

    }
    return obj;
}


var ind = function (selector) {
    var toReturn = indObj.create(selector);
    return toReturn
}

var indObj = Class({
    constructor: function(selector) {
        var self = {};
        var nl = document.querySelectorAll(selector);
        for (var i = 0; i < nl.length; i++) {
            self[i] = nl[i];
        }
        self.nodeList = nl;
        self.selector = selector;
        return self
    },
    proto: {
        each: {
            value: function (callback) {
                var self = this;
                Array.prototype.forEach.call(self.nodeList, callback)
                return self
            }
        }
    }
})

/*indObj.prototype.each = function (callback) {
    var self = this;
    Array.prototype.forEach.call(this.nodeList, callback)
    return this
};*/

indObj.prototype.animateTransition = function (propertyObj, duration, easing, callback) {
    var self = this;
    Array.prototype.forEach.call(document.querySelectorAll(self.selector), function (el) {
        var transitionStr = ""
        for (key in propertyObj) {
            transitionStr  += key + ' ' + (duration || '2s') + ' ,';
        }
        el.style.transition = transitionStr

        for (key in propertyObj) {
            el.style[key] = propertyObj[key];
        }
        el.addEventListener('transitionend', callback);
    })
    return this
};

var directMethods = ['addEventListener', 'removeEventListener', 'remove', 'hasAttribute', 'removeAttribute']
var properties = ['dataset', 'style']

directMethods.forEach(function (a) {
    indObj.prototype[a] = function () {
        var self = this;
        var args = arguments;

        self.each(function (el) {
            Element.prototype[a].apply(el, args);
        });
        return self
    }
});

properties.forEach(function (a) {
    indObj.prototype[a] = function (callbackOrString) {
        var self = this;

        self.each(function (el) {

            var obj = callback.call(el);
            for(key in obj){
                el[a][key] = obj[key]
            }
        });
        return self

    }
});



Construct = function(newConstructor, newPrototype, extendsClass){
    var newConstructor = newConstructor;
    newPrototype.constructor = {value: newConstructor};
    newConstructor.prototype = Object.create(extendsClass.prototype, newPrototype)
    return newConstructor;
}

