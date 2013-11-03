# Backbone.CollectionView

Collection view implementation for Backbone.

## Installation

Via npm:

```
npm install backbone-collection-view
```

Via Git:

```
git clone git://github.com/bryandragon/backbone-collection-view.git
```

## Running Tests

To run the tests, clone the repository and install the dev dependencies.

```
git clone git://github.com/bryandragon/backbone-collection-view.git
cd backbone-collection-view
npm install
make test
```

Note: You will need [PhantomJS](http://phantomjs.org) installed in order to run the tests, as tests rely on [phantomjs-mocha](https://github.com/metaskills/mocha-phantomjs).

You can also simply open `test/index.html` in a browser to run the tests.

## Production Build

There is a Make task to build a minified production version of the script. Output will be generated under `dist/collection-view.min.js`.

```
make build
```

## API

#### `getSubviews()`

#### `getSubviewIndex(view)`

#### `getSubviewAtIndex(index)`

#### `getFirstSubview()`

#### `getLastSubview()`

#### `containsSubview(view)`

#### `addSubviewAtIndex(view, index)`

#### `addSubview(view)`

#### `removeSubviewAtIndex(index)`

#### `removeSubview(view)`

#### `removeAllSubviews()`

#### `getSubviewForItem(model)`

#### `addSubviewForItemAtIndex(model, index)`

#### `addSubviewForItem(model)`

#### `removeSubviewForItem(model)`

#### `buildSubviewForItem(model)`

#### `renderAllItems()`

### Options

#### `itemView` : `Backbone.View`

### Events

#### `'subview:before:add'`

#### `'subview:add'`

#### `'subview:before:remove'`

#### `'subview:remove'`

## License

(The MIT License)

Copyright (c) 2013 Bryan Dragon

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
