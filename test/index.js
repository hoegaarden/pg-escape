
var assert = require('assert');
var escape = require('..');

describe('escape(fmt, ...)', function(){
  describe('%s', function(){
    it('should format as a simple string', function(){
      escape('some %s here', 'thing')
        .should.equal('some thing here');

      escape('some %s thing %s', 'long', 'here')
        .should.equal('some long thing here');
    })
  })

  describe('%%', function(){
    it('should format as %', function(){
      escape('some %%', 'thing')
        .should.equal('some %');
    })
  })

  describe('%I', function(){
    it('should format as an identifier', function(){
      escape('some %I', 'foo/bar/baz')
        .should.equal('some "foo/bar/baz"');
    })
  })

  describe('%L', function(){
    it('should format as a literal', function(){
      escape('%L', "Tobi's")
        .should.equal("'Tobi''s'");
    })
  })
})

describe('escape.string(val)', function(){
  it('should coerce to a string', function(){
    escape.string().should.equal('');
    escape.string(0).should.equal('0');
    escape.string(15).should.equal('15');
    escape.string('something').should.equal('something');
  })
})

describe('escape.ident(val)', function(){
  it('should quote when necessary', function(){
    escape.ident('foo').should.equal('foo');
    escape.ident('_foo').should.equal('_foo');
    escape.ident('_foo_bar$baz').should.equal('_foo_bar$baz');
    escape.ident('test.some.stuff').should.equal('"test.some.stuff"');
    escape.ident('test."some".stuff').should.equal('"test.""some"".stuff"');
  })

  it('should throw when null', function(done){
    try {
      escape.ident();
    } catch (err) {
      assert(err.message == 'identifier required');
      done();
    }
  })
})

describe('escape.literal(val)', function(){
  it('should return NULL for null', function(){
    escape.literal(null).should.equal('NULL');
    escape.literal(undefined).should.equal('NULL');
  })

  it('should quote', function(){
    escape.literal('hello world').should.equal("'hello world'");
  })

  it('should escape quotes', function(){
    escape.literal("O'Reilly").should.equal("'O''Reilly'");
  })

  it('should escape backslashes', function(){
    escape.literal('\\whoop\\').should.equal("E'\\\\whoop\\\\'");
  })
})