# Backbone.CollectionView

Collection view implementation for Backbone.

## Installation

```
npm install backbone-collection-view
```

## Running Tests

You will need [PhantomJS](http://phantomjs.org) installed in order to run the tests, as tests rely on [phantomjs-mocha](https://github.com/metaskills/mocha-phantomjs).

```
npm install
make test
```

## API

#### getSubviews()

#### getSubviewIndex(view)

#### getSubviewAtIndex(index)

#### getFirstSubview()

#### getLastSubview()

#### containsSubview(view)

#### addSubviewAtIndex(view, index)

#### addSubview(view)

#### removeSubviewAtIndex(index)

#### removeSubview(view)

#### removeAllSubviews()

#### getSubviewForItem(model)

#### addItemAtIndex(model, index)

#### addItem(model)

#### removeItem(model)

#### buildSubviewForItem(model)

#### renderAllItems()

### Options

#### itemView : Backbone.View

## License

MIT

