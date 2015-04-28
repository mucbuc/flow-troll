module.exports = function(stack, cb){
  var count = 0; 
  stack
    .use(function(o) {
      console.log( 'hit count:', count++ );
      o.next(); 
    })
    .use(function(o) {
      o.next( { input: {} } );
    })
    .use( 'filter', function(o) {
      o.input.prop = "value";
      o.status = 1;
      o.next(); 
    })
    .use( /noop/, function(o) {
      console.log( 'got nooped' ); 
      o.next();   
    })
    .process()
    .process('noop')
    .process(function() {
      console.log( 'another' );
    })
    .process('filter', function(o) {
      console.log( o.input, o.status ); 
    });
};
