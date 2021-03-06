// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
 * This is a regression test for https://github.com/joyent/node/issues/8874.
 */
var common = require('../common');
var assert = require('assert');

var spawn = require('child_process').spawn;
// use -i to force node into interactive mode, despite stdout not being a TTY
var args = [ '-i' ];
var child = spawn(process.execPath, args);

var input = 'var foo = "bar\\\nbaz"';
// Match '...' as well since it marks a multi-line statement
var expectOut = /^> ... undefined\n/;

child.stderr.setEncoding('utf8');
child.stderr.on('data', function(c) {
  throw new Error('child.stderr be silent');
});

child.stdout.setEncoding('utf8');
var out = '';
child.stdout.on('data', function(c) {
  out += c;
});

child.stdout.on('end', function() {
  assert(expectOut.test(out));
  console.log('ok');
});

child.stdin.end(input);
