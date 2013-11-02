describe('Backbone.CollectionView', function () {
  'use strict';

  var Model = Backbone.Model.extend({
    defaults: {
      name: 'Default',
      desc: 'Description'
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<%=name%>')
  });

  var CollectionView = Backbone.CollectionView.extend({
    itemView: ItemView,
    tagName: 'ul'
  });

  var models = [];
  for (var i = 1; i <= 100; i++) {
    models.push({id: i});
  }

  function createInstance() {
    var c = new Collection(models);
    var cv = new CollectionView({collection: c});

    $(document.body).append(cv.render().el);

    return cv;
  }

  it('should extend Backbone.View', function () {
    var cv = createInstance();
    expect(cv).to.be.an.instanceof(Backbone.View);
  });

  describe('.getSubviews()', function () {
    it('should return an array of sub-views', function () {
      var cv = createInstance()
        , subviews = cv.getSubviews();

      expect(subviews).to.be.an('array');
      expect(subviews).to.have.length(models.length);
    });
  });

  describe('.containsSubview()', function () {
    it('should return true for existing sub-views', function () {
      var cv = createInstance()
        , subviews = cv.getSubviews()
        , view = subviews[0];

      expect(cv.containsSubview(view)).to.equal(true);
    });

    it('should return false for non-existent sub-views', function () {
      var cv = createInstance()
        , view = new ItemView;

      expect(cv.containsSubview(view)).to.equal(false);
    });
  });

  describe('.getSubviewIndex()', function () {
    it('should return the correct index for a given sub-view', function () {
      var cv = createInstance()
        , subviews = cv.getSubviews()
        , index = 1
        , view = subviews[index];

      expect(cv.getSubviewIndex(view)).to.equal(index);
    });

    it('should return -1 for a non-existent sub-view', function () {
      var cv = createInstance()
        , view = new ItemView;

      expect(cv.getSubviewIndex(view)).to.equal(-1);
    });
  });

  describe('.getSubviewAtIndex()', function () {
    it('should return the correct sub-view for a given index', function () {
      var cv = createInstance()
        , subviews = cv.getSubviews()
        , index = 1
        , view = subviews[index];

      expect(cv.getSubviewAtIndex(index)).to.equal(view);
    });

    it('should return null for an invalid index', function () {
      var cv = createInstance();

      expect(cv.getSubviewAtIndex(-1)).to.equal(null);
      expect(cv.getSubviewAtIndex(10000)).to.equal(null);
    });
  });

  describe('.getFirstSubview()', function () {
    it('should return the first sub-view', function () {
      var cv = createInstance()
        , view = cv.getSubviewAtIndex(0);

      expect(cv.getFirstSubview()).to.equal(view);
    });
  });

  describe('.getLastSubview()', function () {
    it('should return the last sub-view', function () {
      var cv = createInstance()
        , view = cv.getSubviewAtIndex(models.length - 1);

      expect(cv.getLastSubview()).to.equal(view);
    });
  });

  describe('.addSubviewAtIndex()', function () {
    it('should throw a TypeError for an invalid view', function () {
      var cv = createInstance();

      function fn() {
        cv.addSubviewAtIndex(null, 1);
      };

      expect(fn).to.throw(TypeError);
    });

    it('should throw a TypeError for an invalid index', function () {
      var cv = createInstance()
        , view = new ItemView;

      function lower() {
        cv.addSubviewAtIndex(view, -1);
      }

      function upper() {
        cv.addSubviewAtIndex(view, models.length + 1);
      }

      expect(lower).to.throw(TypeError);
      expect(upper).to.throw(TypeError);
    });

    it('should add a sub-view at the given index', function () {
      var cv = createInstance()
        , index = 1
        , view = new ItemView;

      cv.addSubviewAtIndex(view, index);

      expect(cv.getSubviews().length).to.equal(models.length + 1);
      expect(cv.getSubviewAtIndex(index)).to.equal(view);
    });

    it('should move an existing sub-view to a new index', function () {
      var cv = createInstance()
        , oldIndex = 1
        , newIndex = 3
        , view = cv.getSubviewAtIndex(oldIndex)
        , nextSibling = cv.getSubviewAtIndex(oldIndex + 1);

      cv.addSubviewAtIndex(view, newIndex);

      expect(cv.getSubviews().length).to.equal(models.length);
      expect(cv.getSubviewAtIndex(newIndex)).to.equal(view);
      expect(cv.getSubviewAtIndex(oldIndex)).to.equal(nextSibling);
    });

    it('should be a no-op for an existing sub-view at its current index', function () {
      var cv = createInstance()
        , index = 1
        , view = cv.getSubviewAtIndex(index)
        , onBeforeAdd = sinon.spy()
        , onAdd = sinon.spy();

      cv.on('subview:before:add', onBeforeAdd);
      cv.on('subview:add', onAdd);
      cv.addSubviewAtIndex(view, index);

      expect(cv.getSubviews().length).to.equal(models.length);
      expect(cv.$el.children().length).to.equal(models.length);
      expect(onBeforeAdd.callCount).to.equal(0);
      expect(onAdd.callCount).to.equal(0);
      cv.off('subview:before:add', onBeforeAdd);
      cv.off('subview:add', onAdd);
    });

    it('should update the DOM when a sub-view is added', function () {
      var cv = createInstance()
        , index = 1
        , view = new ItemView
        , el = cv.getSubviewAtIndex(index).el;

      cv.addSubviewAtIndex(view, index);

      expect(cv.$el.children().length).to.equal(models.length + 1);
      expect(cv.$el.children().get(index)).to.equal(view.el);
      expect(cv.$el.children().get(index + 1)).to.equal(el);
    });

    it('should update the DOM when an existing sub-view is added (moved)', function () {
      var cv = createInstance()
        , oldIndex = 1
        , newIndex = 3
        , view = cv.getSubviewAtIndex(oldIndex)
        , el = view.el;

      expect(cv.$el.children().get(oldIndex)).to.equal(el);

      cv.addSubviewAtIndex(view, newIndex);

      expect(cv.$el.children().length).to.equal(models.length);
      expect(cv.$el.children().get(oldIndex)).not.to.equal(el);
      expect(cv.$el.children().get(newIndex - 1)).to.equal(el);
    });

    it('should trigger `subview:before:add` before adding a sub-view', function (done) {
      var cv = createInstance()
        , view = new ItemView;

      var beforeAdd = function () {
        expect(cv.getSubviews().length).to.equal(models.length);
        expect(cv.$el.children().length).to.equal(models.length);
      };

      var onBeforeAdd = sinon.spy(beforeAdd);

      cv.on('subview:before:add', onBeforeAdd);
      cv.addSubviewAtIndex(view, 0);

      _.defer(function () {
        expect(onBeforeAdd.calledOnce).to.equal(true);
        expect(onBeforeAdd.alwaysCalledWith(view, cv)).to.equal(true);
        cv.off('subview:before:add', onBeforeAdd);
        done();
      });
    });

    it('should trigger `subview:add` after adding a sub-view', function (done) {
      var cv = createInstance()
        , index = 0
        , view = new ItemView;

      var add = function () {
        expect(cv.getSubviews().length).to.equal(models.length + 1);
        expect(cv.$el.children().length).to.equal(models.length + 1);
      };

      var onAdd = sinon.spy(add);

      cv.on('subview:add', onAdd);
      cv.addSubviewAtIndex(view, index);

      _.defer(function () {
        expect(onAdd.calledOnce).to.equal(true);
        expect(onAdd.getCall(0).args[0]).to.equal(view);
        expect(onAdd.getCall(0).args[1]).to.equal(cv);
        expect(onAdd.getCall(0).args[2]).to.eql({at: index});
        cv.off('subview:add', onAdd);
        done();
      });
    });
  });

  describe('.addSubview()', function () {
    it('should append a sub-view', function () {
      var cv = createInstance()
        , view = new ItemView;

      cv.addSubview(view);

      expect(cv.getSubviews().length).to.equal(models.length + 1);
      expect(cv.getSubviewAtIndex(models.length)).to.equal(view);
    });

    it('should be a no-op for an existing sub-view', function () {
      var cv = createInstance()
        , view = cv.getLastSubview();

      cv.addSubview(view);

      expect(cv.getSubviews().length).to.equal(models.length);
    });
  });

  describe('.removeSubviewAtIndex()', function () {
    it('should remove the sub-view at the given valid index', function () {
      var cv = createInstance()
        , index = 1
        , view;

      view = cv.getSubviewAtIndex(index);

      cv.removeSubviewAtIndex(index);

      expect(cv.getSubviews().length).to.equal(models.length - 1);
      expect(cv.getSubviewAtIndex(index)).not.to.equal(view);
    });

    it('should update the DOM when a sub-view is removed', function () {
      var cv = createInstance()
        , index = 1
        , view = cv.getSubviewAtIndex(index)
        , el = view.el;

      expect(cv.$el.children().get(index)).to.equal(el);

      cv.removeSubviewAtIndex(index);

      expect(cv.$el.children().length).to.equal(models.length - 1);
      expect(cv.$el.children().get(index)).not.to.equal(el);
    });

    it('should be a no-op for a non-existent sub-view', function () {
      var cv = createInstance();

      cv.removeSubviewAtIndex(10000);

      expect(cv.getSubviews().length).to.equal(models.length);
    });

    it('should trigger `subview:before:remove` before removing a sub-view', function (done) {
      var cv = createInstance()
        , index = 0
        , view = cv.getSubviewAtIndex(index);

      var beforeRemove = function () {
        expect(cv.getSubviews().length).to.equal(models.length);
        expect(cv.$el.children().length).to.equal(models.length);
      };

      var onBeforeRemove = sinon.spy(beforeRemove);

      cv.on('subview:before:remove', onBeforeRemove);
      cv.removeSubviewAtIndex(index);

      _.defer(function () {
        expect(onBeforeRemove.calledOnce).to.equal(true);
        expect(onBeforeRemove.alwaysCalledWith(view, cv)).to.equal(true);
        cv.off('subview:before:remove', onBeforeRemove);
        done();
      });
    });

    it('should trigger `subview:remove` after removing a sub-view', function (done) {
      var cv = createInstance()
        , index = 0
        , view = cv.getSubviewAtIndex(index);

      var remove = function () {
        expect(cv.getSubviews().length).to.equal(models.length - 1);
        expect(cv.$el.children().length).to.equal(models.length - 1);
      };

      var onRemove = sinon.spy(remove);

      cv.on('subview:remove', onRemove);
      cv.removeSubviewAtIndex(index);

      _.defer(function () {
        expect(onRemove.calledOnce).to.equal(true);
        expect(onRemove.getCall(0).args[0]).to.equal(view);
        expect(onRemove.getCall(0).args[1]).to.equal(cv);
        expect(onRemove.getCall(0).args[2]).to.eql({index: index});
        cv.off('subview:remove', onRemove);
        done();
      });
    });
  });

  describe('.removeSubview()', function () {
    it('should remove the given sub-view', function () {
      var cv = createInstance()
        , index = 1
        , view = cv.getSubviewAtIndex(index);

      cv.removeSubview(view);

      expect(cv.getSubviews().length).to.equal(models.length - 1);
      expect(cv.getSubviewAtIndex(index)).not.to.equal(view);
    });

    it('should be a no-op for a non-existent sub-view', function () {
      var cv = createInstance()
        , view = new ItemView;

      cv.removeSubview(view);

      expect(cv.getSubviews().length).to.equal(models.length);
    });
  });

  describe('.removeAllSubviews()', function () {
    it('should remove all sub-views', function () {
      var cv = createInstance();

      cv.removeAllSubviews();

      expect(cv.getSubviews().length).to.equal(0);
    });

    it('should be a no-op when there are no sub-views', function () {
      var cv = createInstance();

      cv.removeAllSubviews();
      cv.removeAllSubviews();
    });
  });

  describe('.getSubviewForItem()', function () {
    it('should return the sub-view for a valid model', function () {
      var cv = createInstance()
        , index = 1
        , model = cv.collection.at(index)
        , view = cv.getSubviewAtIndex(index);

      expect(cv.getSubviewForItem(model)).to.equal(view);
    });

    it('should return null for a non-existent model', function () {
      var cv = createInstance()
        , mod = new Model;

      expect(cv.getSubviewForItem(mod)).to.equal(null);
    });
  });

  describe('.addItem()', function () {
    it('should append a sub-view for the given model', function () {
      var cv = createInstance()
        , model = new Model;

      cv.addItem(model);

      expect(cv.getSubviews().length).to.equal(models.length + 1);
      expect(cv.getSubviewAtIndex(models.length)).to.be.ok;
    });

    it('should be a no-op for an existing model', function () {
      var cv = createInstance()
        , model = cv.collection.at(0);

      cv.addItem(model);

      expect(cv.getSubviews().length).to.equal(models.length);
      expect(cv.getSubviewAtIndex(models.length)).to.equal(null);
    });
  });

  describe('.addItemAtIndex()', function () {
    it('should add a sub-view for the given model at the given index', function () {
      var cv = createInstance()
        , index = 10
        , model = new Model
        , view = cv.getSubviewAtIndex(index);

      cv.addItemAtIndex(model, index);

      expect(cv.getSubviews().length).to.equal(models.length + 1);
      expect(cv.getSubviewAtIndex(index)).not.to.equal(view);
    });

    it('should be a no-op for an existing model', function () {
      var cv = createInstance()
        , index = 10
        , model = cv.collection.at(index)
        , view = cv.getSubviewAtIndex(index);

      cv.addItemAtIndex(model, index);

      expect(cv.getSubviews().length).to.equal(models.length);
      expect(cv.getSubviewAtIndex(index)).to.equal(view);
    });
  });

  describe('.removeItem()', function () {
    it('should remove the sub-view for the given model', function () {
      var cv = createInstance()
        , index = 10
        , model = cv.collection.at(index)
        , view = cv.getSubviewAtIndex(index);

      cv.removeItem(model);

      expect(cv.getSubviews().length).to.equal(models.length - 1);
      expect(cv.getSubviewAtIndex(index)).not.to.equal(view);
    });

    it('should be a no-op for a non-existent model', function () {
      var cv = createInstance()
        , mod = new Model;

      cv.removeItem(mod);

      expect(cv.getSubviews().length).to.equal(models.length);
    });
  });

  describe('when collection events occur', function () {
    it('should add a sub-view for a model added to the collection', function () {
      var cv = createInstance()
        , collection = cv.collection
        , model = new Model;

      var onAdd = function () {
        _.defer(function () {
          expect(cv.getSubviews().length).to.equal(models.length + 1);
          expect(cv.getLastSubview().model).to.equal(model);
          collection.off('add', onAdd);
        });
      };

      collection.on('add', onAdd);
      collection.add(model);
    });

    it('should remove the sub-view for a model removed from the collection', function () {
      var cv = createInstance()
        , index = 10
        , collection = cv.collection
        , model = collection.at(index)
        , view = cv.getSubviewAtIndex(index);

      var onRemove = function () {
        _.defer(function () {
          expect(cv.getSubviews().length).to.equal(models.length - 1);
          expect(cv.getSubviewAtIndex(index)).not.to.equal(view);
          collection.off('remove', onRemove);
        });
      };

      collection.on('remove', onRemove);
      collection.remove(model);
    });

    it('should update sub-views when the collection is reset', function () {
      var cv = createInstance()
        , collection = cv.collection
        , resetModels = [{}, {}, {}];

      var onReset = function () {
        _.defer(function () {
          expect(cv.getSubviews().length).to.equal(resetModels.length);
          collection.off('reset', onReset);
        });
      };

      collection.on('reset', onReset);
      collection.reset(resetModels);
    });
  });

});
