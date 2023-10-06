const functionProxy = new Proxy(trackHandler,{
    apply:function(target, thisArg, argumentsList) {
               console.log("Before Tracking Call");
        var result = Reflect.apply(target, thisArg, argumentsList);
            console.log("After Tracking Call");
        return result;
    },
});
trackHandler = functionProxy;

// https://devissuefixer.com/questions/can-i-listen-to-a-function-call-using-javascript