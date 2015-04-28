var assert = require( 'assert' );

function Stack() {

  var layers = [];

  this.use = function() {
    if (arguments.length == 1) {
      layers.push( { 
        invoke: arguments[0] 
      } ); 
    }
    else if (arguments.length == 2) {
      layers.push( { 
        filter: arguments[0], 
        invoke: arguments[1] 
      } );
    }
    return this;
  };

  this.process = function() {

    var index = 0
      , originalInput = ''
      , callBack = function() {}
      , contextCache;

    if (arguments.length == 2) {
      originalInput = arguments[0];
      callBack = arguments[1]; 
    }
    else if (arguments.length == 1) {
      var type = typeof arguments[0];
      if (type === 'function') {
        callBack = arguments[0];
      }
      else if (type === 'string') {
        originalInput = arguments[0];
      }      
    }
    
    processNext( { input: originalInput } ); 

    return this; 

    function processNext(context) {

      if (typeof context === 'undefined') {
        context = contextCache; 
      }
      else {
        contextCache = context;
      }

      if (index < layers.length) {
        var layer = layers[index++];
        if (  !layer.hasOwnProperty('filter')
           || originalInput.match(layer.filter) ) {
          context.next = processNext;
          layer.invoke( context );
        }
        else {
          processNext(context);
        }
      } 
      else {
        delete context.next;
        callBack( context );
      }  
    }
  };

  this.__defineGetter__( 'layers', function() {
    return layers;
  });

  this.__defineSetter__( 'layers', function(l) {
    layers = l; 
  });
}

module.exports = Stack;
