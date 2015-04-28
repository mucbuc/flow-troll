flow-troll
==========

middleware stack

## dependencies: (tests only) 
- chai: https://github.com/chaijs/chai
- expector: https://github.com/mucbuc/expector
- mocha: https://github.com/mochajs/mocha

## how to use 
```  
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
```
output:
```
hit count: 0
hit count: 1
got nooped
hit count: 2
another
hit count: 3
{ prop: 'value' } 1
```

## run the test
`npm install`  
`npm test`
