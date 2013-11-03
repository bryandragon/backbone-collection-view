(function (root, factory) {
  'use strict';

  if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('backbone'));
  }
  else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  }
  else {
    return factory(root._, root.Backbone);
  }

}(this, function (_, Backbone) {

  Backbone.CollectionView = Backbone.View.extend({

    itemView: null,

    initialize: function (options) {
      options || (options = {});

      this._subviews = [];

      if (options.itemView) {
        this.itemView = options.itemView;
      }

      if (options.collection) {
        this.collection = options.collection;
      }

      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onAdd);
        this.listenTo(this.collection, 'remove', this._onRemove);
        this.listenTo(this.collection, 'reset', this._onReset);

        this.collection.each(function (model, i) {
          this.addItemAtIndex(model, i);
        }, this);
      }
    },

    render: function () {
      this.renderAllItems();
      return this;
    },

    renderAllItems: function () {
      var that = this
        , items = this.collection.models;

      this.removeAllSubviews();

      _.each(items, function (item, i) {
        that.addItemAtIndex(item, i);
      });

      return this;
    },

    dispose: function () {
      var that = this;

      this.stopListening();
      this.$el.remove();

      _.each(['_subviews'], function (prop) {
        delete that[prop];
      });
    },

    // Subview API

    getSubviews: function () {
      var views = this._subviews.concat();
      return views;
    },

    getSubviewIndex: function (view) {
      if (!view) { return -1; }
      for (var i = 0, len = this._subviews.length; i < len; i++) {
        if (this._subviews[i] === view) {
          return i;
        }
      }
      return -1;
    },

    getSubviewAtIndex: function (index) {
      var view = this._subviews[index];
      return view ? view : null;
    },

    getFirstSubview: function () {
      var view = this._subviews[0];
      return view ? view : null;
    },

    getLastSubview: function () {
      var len = this._subviews.length;
      return (len > 0) ? this._subviews[len-1] : null;
    },

    containsSubview: function (view) {
      var index = this.getSubviewIndex(view);
      return index >= 0;
    },

    addSubviewAtIndex: function (view, index) {
      var len = this._subviews.length
        , $children = this.$el.children()
        , $existing
        , $reference
        , existingIndex;

      if (!view) {
        throw new TypeError("Backbone.CollectionView: Invalid view");
      }

      if (index < 0 || index > len) {
        throw new TypeError("Backbone.CollectionView: Invalid position");
      }

      if (index == null) { index = len; }

      existingIndex = this.getSubviewIndex(view);

      // break if attempting to add item at its current index
      if (index === existingIndex) { return this; }

      this.trigger('subview:before:add', view, this);

      // remove existing subview from list
      if (existingIndex >= 0) {
        this._subviews.splice(existingIndex, 1);
        $existing = view.$el;
      }

      // add new subview to list
      this._subviews.splice(index, 0, view);

      if (!$existing) { this._renderItemView(view); }

      if ($children.length) {
        if (index === 0) {
          $reference = $children.eq(0);
          if ($reference) { $reference.before(view.el); }
        }
        else {
          $reference = $children.eq(index - 1);
          if ($reference) { $reference.after(view.el); }
        }
      }

      if (!$reference) { this.$el.append(view.el); }

      this.trigger('subview:add', view, this, {at: index});
      view.trigger('added', view, this, {at: index});

      return this;
    },

    addSubview: function (view) {
      if (!this.containsSubview(view)) {
        this.addSubviewAtIndex(view, this._subviews.length);
      }

      return this;
    },

    removeSubviewAtIndex: function (index) {
      var view = this.getSubviewAtIndex(index)
        , $children = this.$el.children()
        , $viewEl;

      if (view) {
        this.trigger('subview:before:remove', view, this);

        this._subviews.splice(index, 1);

        if (_.isFunction(view.dispose)) {
          view.dispose();
        }
        else {
          $viewEl = $children.eq(index);
          if ($viewEl) { $viewEl.remove(); }
        }

        this.trigger('subview:remove', view, this, {index: index});
        view.trigger('removed', view, this, {index: index});
      }

      return this;
    },

    removeSubview: function (view) {
      var index = this.getSubviewIndex(view);

      if (index >= 0) {
        this.removeSubviewAtIndex(index);
      }

      return this;
    },

    removeAllSubviews: function () {
      while (this._subviews.length) {
        this.removeSubviewAtIndex(this._subviews.length - 1);
      }

      return this;
    },

    // Model API

    getSubviewForItem: function (model) {
      var view;

      for (var i = 0, len = this._subviews.length; i < len; i++) {
        view = this._subviews[i];

        if (view.model && view.model.cid === model.cid) {
          return view;
        }
      }

      return null;
    },

    addItemAtIndex: function (model, index) {
      var view = this.getSubviewForItem(model);

      if (!view) {
        view = this.buildSubviewForItem(model);
      }

      this.addSubviewAtIndex(view, index);

      return this;
    },

    addItem: function (model) {
      this.addItemAtIndex(model, this._subviews.length);

      return this;
    },

    removeItem: function (model) {
      var view = this.getSubviewForItem(model);

      if (view) {
        this.removeSubview(view);
      }

      return this;
    },

    buildSubviewForItem: function (model) {
      var ItemView = this.itemView;

      if (ItemView) {
        return new ItemView({model: model});
      }
      else {
        throw new Error("No itemView found");
      }
    },

    // Private API

    _renderItemView: function (view) {
      view.render();
      return view;
    },

    _onReset: function (collection, options) {
      this.renderAllItems();
    },

    _onAdd: function (item, collection, options) {
      this.addItemAtIndex(item, options.at);
    },

    _onRemove: function (item, collection, options) {
      this.removeItem(item);
    }
  });

  Backbone.CollectionView.extend = Backbone.Model.extend;

  return Backbone.CollectionView;

}));
