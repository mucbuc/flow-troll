#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Stack = require( './index.js' )
  , SeqExpector = require( 'expector' ).SeqExpector;

assert( typeof Stack === 'function' );
assert( typeof SeqExpector !== 'undefined' );

suite( 'flow-troll', function() {

  var stack;

  setup(function() {
    stack = new Stack();
    expector = new SeqExpector();
  });

  teardown(function() {
    expector.check();
  });

  test( 'should invoke callback without process arguments', function() {
    expector.expect( 'event' ); 
    stack
      .use( function() { 
        expector.emit( 'event' );
      } )
      .process();
  });

  test( 'should invoke callback', function() {
    expector.expect( 'cb' );
    stack
      .use( function(o) {
        o.next();
      } )
      .process(function() {
        expector.emit( 'cb' );
      });
  });

  test( 'input string next', function() {
    
    expector
      .expect( '#' )
      .expect( '*' )
      .expect( '**' );

    stack
      .use(function(o) {
        expector.emit( o.input );
        o.next({ input: '*' });
      })
      .use(function(o) {
        expector.emit( o.input );
        o.next({ input:'**' });
      })
      .process( '#', function(o) {
        expector.emit( o.input );
      });
  });

  test( 'output object next', function() {
    
    var obj1 = { wtf: 'aarg' }
      , obj2 = { sob: 'asddfadsf' };

    expector
      .expect( obj1 )
      .expect( obj2 );

    stack
      .use(function(o) {
        o.next( { output: obj1 });
      })
      .use(function(o) {
        expector.emit( o.output );
        o.next( { output: obj2 });
      })
      .process( function(o) {
        expector.emit( o.output );
      });
  });

  test( 'input object', function() {
    stack
      .use( function(o) {
        assert( o.input.hasOwnProperty("tester0") );
        assert( !o.input.hasOwnProperty("tester") );
        o.input.tester = 'hey';
        o.next();
      })
      .use( function(o) {
        assert( !o.input.hasOwnProperty("tester2") );
        assert( o.input.hasOwnProperty("tester") );
        o.input.tester2 = 'hey';
        o.next();
      })
      .process( { tester0: "1" }, function(o) {
        assert( o.input.hasOwnProperty("tester0") );
        assert( o.input.hasOwnProperty("tester") );
        assert( o.input.hasOwnProperty("tester2") );
      });
  });

  test( 'output object', function() {
    stack
      .use( function(o) {
        assert( !o.hasOwnProperty("tester") );
        o.tester = 'hey';
        o.next();
      })
      .use( function(o) {
        assert( !o.hasOwnProperty("tester2") );
        assert( o.hasOwnProperty("tester") );
        o.tester2 = 'hey';
        o.next();
      })
      .process( function(o) {
        assert( o.hasOwnProperty("tester") );
        assert( o.hasOwnProperty("tester2") );
      });
  });

  test( 'input cache', function() {
    stack
      .use( function(o) {
        o.next();
      })
      .process( "hello", function(o) {
        assert( o.input === "hello" );
      });
  });

  test( 'output cache', function() {
    stack
      .use( function(o) {
        o.sub = "hello";
        o.next();
      })
      .process( function(o) {
        assert( o.hasOwnProperty( "sub" ) );
      });
  });

  test( 'final context doesn\'t have next', function() {
    stack
      .use( function(o) {
        o.next();
      })
      .process( function(o) {
        assert( !o.hasOwnProperty( 'next' ) );
      });
  });

  test( 'invocation', function() {

    var s = new Stack();

    s.use( /bla/, bumpCounter ); 
    s.process( expectCounter(0) );
    s.process( expectCounter(0) );

    s.use( /.*/, bumpCounter );
    s.process( "", expectCounter(1) );

    s.use( bumpCounter );
    s.process( "", expectCounter(2) );

    s.use( 'hey', bumpCounter );
    s.process( "ha", expectCounter(2) );

    function expectCounter(count) {
      return function( o ) {
        if (  o.hasOwnProperty('output') 
           && o.output.hasOwnProperty('counter')) {
          assert( o.output.counter == count );
        }
      };
    }

    function bumpCounter(o) {
      if (o.hasOwnProperty("output")) {
        if (o.output.hasOwnProperty('counter')) {
          ++o.output.counter;
        } 
        else {
          o.output.counter = 1; 
        }
      }
      o.next();
    }
  });

  test( 'next is bound correctly', function() {
    var s = new Stack();
    s.use( function( o ) {
      assert( o.next.toString() == 'function () { [native code] }' );
    } );

    s.process();
  });

  test( 'simple_example', function() {
    require( './example.js' )(stack, function(res) {
    });
  });

}); 
