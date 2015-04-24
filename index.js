var assert = require( 'assert' );

function Stack() {

  var layers = [];

  this.use = function() {
    
    layers.push( arguments ); 
    return this;
  };

  this.process = function() {

    var index = 0
      , originalInput = ''
      , callBack = function() {}
      , inputCache
      , outputCache;

    switch (arguments.length) {
      case 2:
        originalInput = arguments[0];
        callBack = arguments[1]; 
        break;
      case 1:
        var type = typeof arguments[0];
        if (type === 'function') {
          callBack = arguments[0];
        }
        else if (type === 'string') {
          originalInput = arguments[0];
        }      
        break;
    }
  
    assert(typeof originalInput !== 'undefined' );
    assert(typeof callBack === 'function');

    processNext( { input: originalInput, output: {} } ); 

    return this; 

    function processNext(options) {

      if (typeof options === 'undefined') {
        options = { 
          input: inputCache, 
          output: outputCache
        }; 
      }
      else {
          if (options.hasOwnProperty('input')) {
            inputCache = options.input;
          }
          options.input = inputCache;
      
          if (options.hasOwnProperty('output')) {
            outputCache = options.output; 
          }
          options.output = outputCache;
      }

      if (index < layers.length) {
        process( layers[index++] );
      } 
      else {
        callBack( options );
      }  

      function process( layer ) {

        if (layer.length == 1) {
          layer[0]( layerOptions() );
        }
        else if (  layer.length == 2
                && originalInput.match( layer[0]) ) {
          layer[1]( layerOptions() );
        }
        else {
          processNext(options);
        }

        function layerOptions() {
          return { 
            input: options.input, 
            output: options.output, 
            next: processNext
          };
        }
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
