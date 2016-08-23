/**
 * Lawnchair!
 * ---
 * clientside json store
 *
 */
var Lawnchair = function(options, callback) {
  // ensure Lawnchair was called as a constructor
  if (!(this instanceof Lawnchair)) return new Lawnchair(options, callback);

  // lawnchair requires json
  if (!JSON)
    throw 'JSON unavailable! Include http://www.json.org/json2.js to fix.'
  // options are optional; callback is not
  if (arguments.length <= 2) {
    callback = (typeof arguments[0] === 'function') ? arguments[0] : arguments[1];
    options = (typeof arguments[0] === 'function') ? {} : arguments[0] || {};
  } else {
    throw 'Incorrect # of ctor args!'
  }

  // default configuration
  this.record = options.record || 'record' // default for records
  this.name = options.name || 'records' // default name for underlying store
  this.keyPath = options.keyPath || 'key' // default identifier property

  // mixin first valid  adapter
  var adapter
  // if the adapter is passed in we try to load that only
  if (options.adapter) {

    // the argument passed should be an array of prefered adapters
    // if it is not, we convert it
    if (typeof (options.adapter) === 'string') {
      options.adapter = [options.adapter];
    }

    // iterates over the array of passed adapters
    for (var j = 0, k = options.adapter.length; j < k; j++) {

      // itirates over the array of available adapters
      for (var i = Lawnchair.adapters.length - 1; i >= 0; i--) {
        if (Lawnchair.adapters[i].adapter === options.adapter[j]) {
          adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
          if (adapter) break
        }
      }
      if (adapter) break
    }

  // otherwise find the first valid adapter for this env
  } else {
    for (var i = 0, l = Lawnchair.adapters.length; i < l; i++) {
      adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined
      if (adapter) break
    }
  }

  // we have failed
  if (!adapter)
    throw 'No valid adapter.'

  // yay! mixin the adapter
  for (var j in adapter)
    this[j] = adapter[j]

  // call init for each mixed in plugin
   for (var i = 0, l = Lawnchair.plugins.length; i < l; i++)
    Lawnchair.plugins[i].call(this)

  // init the adapter
   this.init(options, callback)
};
Lawnchair.adapters = []

/**
 * queues an adapter for mixin
 * ===
 * - ensures an adapter conforms to a specific interface
 *
 */
Lawnchair.adapter = function(id, obj) {
  // add the adapter id to the adapter obj
  // ugly here for a  cleaner dsl for implementing adapters
  obj['adapter'] = id
  // methods required to implement a lawnchair adapter
  var implementing = 'adapter valid init keys save batch get exists all remove nuke'.split(' '),
    indexOf = this.prototype.indexOf
  // mix in the adapter
  for (var i in obj) {
    if (indexOf(implementing, i) === -1)
      throw 'Invalid adapter! Nonstandard method: ' + i
  }
  // if we made it this far the adapter interface is valid
  // insert the new adapter as the preferred adapter
  Lawnchair.adapters.splice(0, 0, obj)
}

Lawnchair.plugins = []

/**
 * generic shallow extension for plugins
 * ===
 * - if an init method is found it registers it to be called when the lawnchair is inited
 * - yes we could use hasOwnProp but nobody here is an asshole
 */
Lawnchair.plugin = function(obj) {
  for (var i in obj)
    i === 'init' ? Lawnchair.plugins.push(obj[i]) : this.prototype[i] = obj[i]
}

/**
 * helpers
 *
 */
Lawnchair.prototype = {

  isArray: Array.isArray || function(o) {
      return Object.prototype.toString.call(o) === '[object Array]'
  },

  /**
   * this code exists for ie8... for more background see:
   * http://www.flickr.com/photos/westcoastlogic/5955365742/in/photostream
   */
  indexOf: function(ary, item, i, l) {
    if (ary.indexOf) return ary.indexOf(item)
    for (i = 0, l = ary.length; i < l; i++)
      if (ary[i] === item) return i
     return -1
  },

  // awesome shorthand callbacks as strings. this is shameless theft from dojo.
  lambda: function(callback) {
    return this.fn(this.record, callback)
  },

  // first stab at named parameters for terse callbacks; dojo: first != best // ;D
  fn: function(name, callback) {
    return typeof callback == 'string' ? new Function(name, callback) : callback
  },

  // returns a unique identifier (by way of Backbone.localStorage.js)
  // TODO investigate smaller UUIDs to cut on storage cost
  uuid: function() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },

  // a classic iterator
  each: function(callback) {
    var cb = this.lambda(callback)
    // iterate from chain
    if (this.__results) {
      for (var i = 0, l = this.__results.length; i < l; i++) cb.call(this, this.__results[i], i)
       }
    // otherwise iterate the entire collection
    else {
      this.all(function(r) {
        for (var i = 0, l = r.length; i < l; i++) cb.call(this, r[i], i)
       })
    }
    return this
  },
  keyEmbellish: function(object) {
    var value = null;
    if ('key' in object) {
      value = object['key'];
    } else {
      value = this.uuid();
      object['key'] = value;
    }
    return value;
  },
  keyExtraction: function(object, key_path) {
    var value = null;
    if ('key' in object) {
      value = object['key'];
    }
    if (!value) {
      value = this.keyEmbellish(object);
    }
    return value;
  },
  keyIsValid: function(key_value, every_index, every_array) {
    var key_is_valid = false;
    if (key_value instanceof Date) {
      key_is_valid = !window.isNaN(key_value.getTime());
    } else if (typeof ( key_value) === 'number') {
      key_is_valid = !window.isNaN(key_value);
    } else if (typeof ( key_value) === 'string') {
      key_is_valid = true;
    } else if (key_value instanceof Array) {
      key_is_valid = key_value.every(this.keyIsValid, key_value);
    }
    return key_is_valid;
  },
  keyObjectComparator: function(key_path) {
    var self = this;
    return function key_object_comparator(leftObj, rightObj) {
      var left_key = self.keyExtraction(leftObj);
      var right_key = self.keyExtraction(rightObj);
      var comparison = self.keyValueComparator()(left_key, right_key);
      return comparison;
    };
  },
  keyValueComparator: function() {
    return function key_value_comparator(left_key, right_key) {
      var comparison = ((left_key < right_key) ? (-1) : ((left_key > right_key) ? (+1) : (0)));
      return comparison;
    };
  }
// --
};
/**
 * dom storage adapter
 * ===
 * - originally authored by Joseph Pecoraro
 *
 */
//
// TODO does it make sense to be chainable all over the place?
// chainable: nuke, remove, all, get, save, all
// not chainable: valid, keys
//
Lawnchair.adapter('dom', (function() {
  var storage = window.localStorage
  // the indexer is an encapsulation of the helpers needed to keep an ordered index of the keys
  var indexer = function(name) {
    return {
      // the key
      key: name + '._index_',
      // returns the index
      all: function() {
        var a = storage.getItem(JSON.stringify(this.key))
        if (a) {
          a = JSON.parse(a)
        }
        if (a === null) storage.setItem(JSON.stringify(this.key), JSON.stringify([])) // lazy init
        return JSON.parse(storage.getItem(JSON.stringify(this.key)))
      },
      // adds a key to the index
      add: function(key) {
        var a = this.all()
        a.push(key)
        storage.setItem(JSON.stringify(this.key), JSON.stringify(a))
      },
      // deletes a key from the index
      del: function(key) {
        var a = this.all(),
          r = []
        // FIXME this is crazy inefficient but I'm in a strata meeting and half concentrating
        for (var i = 0, l = a.length; i < l; i++) {
          if (a[i] != key) r.push(a[i])
        }
        storage.setItem(JSON.stringify(this.key), JSON.stringify(r))
      },
      // returns index for a key
      find: function(key) {
        var a = this.all()
        for (var i = 0, l = a.length; i < l; i++) {
          if (key === a[i]) return i
        }
        return false
      }
    }
  }

  // adapter api
  return {

    // ensure we are in an env with localStorage
    valid: function() {
      return !!storage && function() {
          // in mobile safari if safe browsing is enabled, window.storage
          // is defined but setItem calls throw exceptions.
          var success = true
          var value = Math.random()
          try {
            storage.setItem(value, value)
          } catch (e) {
            success = false
          }
          storage.removeItem(value)
          return success
        }()
    },

    init: function(options, callback) {
      this.indexer = indexer(this.name)
      if (callback) this.fn(this.name, callback).call(this, this)
    },

    save: function(obj, callback) {
      var key = obj.key ? this.name + '.' + obj.key : this.name + '.' + this.uuid()
      // now we kil the key and use it in the store colleciton
      delete obj.key;
      storage.setItem(key, JSON.stringify(obj))
      // if the key is not in the index push it on
      if (this.indexer.find(key) === false) this.indexer.add(key)
      obj.key = key.slice(this.name.length + 1)
      if (callback) {
        this.lambda(callback).call(this, obj)
      }
      return this
    },

    batch: function(ary, callback) {
      var saved = []
      // not particularily efficient but this is more for sqlite situations
      for (var i = 0, l = ary.length; i < l; i++) {
        this.save(ary[i], function(r) {
          saved.push(r)
        })
      }
      if (callback) this.lambda(callback).call(this, saved)
      return this
    },

    // accepts [options], callback
    keys: function(callback) {
      if (callback) {
        var name = this.name
        var indices = this.indexer.all();
        var keys = [];
        //Checking for the support of map.
        if (Array.prototype.map) {
          keys = indices.map(function(r) {
            return r.replace(name + '.', '')
          })
        } else {
          for (var key in indices) {
            keys.push(key.replace(name + '.', ''));
          }
        }
        this.fn('keys', callback).call(this, keys)
      }
      return this // TODO options for limit/offset, return promise
    },

    get: function(key, callback) {
      if (this.isArray(key)) {
        var r = []
        for (var i = 0, l = key.length; i < l; i++) {
          var k = this.name + '.' + key[i]
          var obj = storage.getItem(k)
          if (obj) {
            obj = JSON.parse(obj)
            obj.key = key[i]
          }
          r.push(obj)
        }
        if (callback) this.lambda(callback).call(this, r)
      } else {
        var k = this.name + '.' + key
        var obj = storage.getItem(k)
        if (obj) {
          obj = JSON.parse(obj)
          obj.key = key
        }
        if (callback) this.lambda(callback).call(this, obj)
      }
      return this
    },

    exists: function(key, cb) {
      var exists = this.indexer.find(this.name + '.' + key) === false ? false : true ;
      this.lambda(cb).call(this, exists);
      return this;
    },
    // NOTE adapters cannot set this.__results but plugins do
    // this probably should be reviewed
    all: function(callback) {
      var idx = this.indexer.all(),
        r = [],
        o,
        k
      for (var i = 0, l = idx.length; i < l; i++) {
        k = idx[i] //v
        o = JSON.parse(storage.getItem(k))
        o.key = k.replace(this.name + '.', '')
        r.push(o)
      }
      if (callback) this.fn(this.name, callback).call(this, r)
      return this
    },

    remove: function(keyOrArray, callback) {
      var self = this;
      if (this.isArray(keyOrArray)) {
        // batch remove
        var i,
          done = keyOrArray.length;
        var removeOne = function(i) {
          self.remove(keyOrArray[i], function() {
            if ((--done) > 0) {
              return;
            }
            if (callback) {
              self.lambda(callback).call(self);
            }
          });
        };
        for (i = 0; i < keyOrArray.length; i++)
          removeOne(i);
        return this;
      }
      var key = this.name + '.' +
        ((keyOrArray.key) ? keyOrArray.key : keyOrArray)
      this.indexer.del(key)
      storage.removeItem(key)
      if (callback) this.lambda(callback).call(this)
      return this
    },

    nuke: function(callback) {
      this.all(function(r) {
        for (var i = 0, l = r.length; i < l; i++) {
          this.remove(r[i]);
        }
        if (callback) this.lambda(callback).call(this)
      })
      return this
    }
  }
})());

// I would mark my relationship with javascript as 'its complicated'
Lawnchair.plugin((function() {

  // methods we want to augment with before/after callback registery capability
  var methods = 'save batch get remove nuke'.split(' '),
    registry = {
      before: {},
      after: {}
    }

  // fill in the blanks
  for (var i = 0, l = methods.length; i < l; i++) {
    registry.before[methods[i]] = []
    registry.after[methods[i]] = []
  }

  return {
    // start of module

    // roll thru each method we with to augment
    init: function() {
      for (var i = 0, l = methods.length; i < l; i++) {
        this.evented(methods[i])
      }
    },
    // TODO make private?
    // rewrites a method with before/after callback capability
    evented: function(methodName) {
      var oldy = this[methodName],
        self = this
      // overwrite the orig method
      this[methodName] = function() {
        var args = [].slice.call(arguments),
          beforeObj = args[0],
          oldCallback = args[args.length - 1],
          overwroteCallback = false

        // call before with obj
        this.fire('before', methodName, beforeObj)

        if (typeof oldCallback === 'function') {
          // overwrite final callback with after method injection
          args[args.length - 1] = function(record) {
            oldCallback.call(self, record)
            self.fire('after', methodName, record)
          }
          overwroteCallback = true
        }

        // finally call the orig method
        oldy.apply(self, args)

        // if there was no callback to override for after we invoke here
        if (!overwroteCallback)
          self.fire('after', methodName, beforeObj)
      }
    },

    // TODO definitely make private method
    // for invoking callbacks
    fire: function(when, methodName, record) {
      var callbacks = registry[when][methodName]
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].call(this, record)
      }
    },

    // TODO cleanup duplication that starts here..
    clearBefore: function(methodName) {
      registry.before[methodName] = []
    },

    clearAfter: function(methodName) {
      registry.after[methodName] = []
    },

    // register before callback for methodName
    before: function(methodName, callback) {
      registry.before[methodName].push(callback)
    },

    // register after callback for methodName
    after: function(methodName, callback) {
      registry.after[methodName].push(callback)
    }

  // end module
  }
})());
Lawnchair.plugin({

  // count of rows in the lawnchair collection with property
  count: function(property, callback) {
    // if only one arg we count the collection
    if ([].slice.call(arguments).length === 1) {
      callback = property
      property = 'key'
    }
    var c = 0
    this.each(function(e) {
      if (e[property]) c++
    })
    this.fn('count', callback).call(this, c)
  },

  // adds up property and returns sum
  sum: function(property, callback) {
    var sum = 0
    this.each(function(e) {
      if (e[property])
        sum += e[property]
    })
    this.fn('sum', callback).call(this, sum)
  },

  // averages a property
  avg: function(property, callback) {
    this.sum(property, function(sum) {
      this.count(property, function(count) {
        this.fn('avg', callback).call(this, sum / count)
      })
    })
  },

  // lowest number
  min: function(property, callback) {
    this._minOrMax('min', property, callback)
  },

  // highest number
  max: function(property, callback) {
    this._minOrMax('max', property, callback)
  },

  // helper for min/max
  _minOrMax: function(m, p, c) {
    var r, all
    this.all(function(a) {
      all = a.map(function(e) {
        return e[p]
      })
      r = Math[m].apply(Math, all)
    })
    this.fn(m, c).call(this, r)
  }
// --
});
// Allows customization of primary key with 'keyPath' option.  Follows the
//    most complex IndexedDB specification, but works in other adapters.
Lawnchair.plugin({
  keyEmbellish: function(object) {
    var self = this;
    var value = null;
    // If this 'keyPath' (not 'key_path') is a simple (i.e. top level, single value) key...
    if (typeof (self.keyPath) === 'string' && self.keyPath.indexOf(',') == -1 && self.keyPath.indexOf('.') == -1) {
      // Return what is already defined.
      if (self.keyPath in object) {
        value = object[self.keyPath];
      }
      // Provide a unique identifier for the object and assign the identifier to key.
      else {
        value = self.uuid();
        object[self.keyPath] = value;
      }
    }
    return value;
  },
  keyExtraction: function(object, key_path) {
    // http://www.w3.org/TR/IndexedDB/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
    var self = this;
    key_path = key_path || self.keyPath;
    var value = null;
    if (typeof (key_path) === 'string') {
      //3.3.6#2
      if (key_path.length == 0) {
        value = object;
      } else {
        //3.3.6#1
        if (key_path.indexOf(',') > -1) {
          var sequence_values = [];
          key_path.split(',').forEach(function(key_sequence, s, key_sequences) {
            var sub_key = self.keyExtraction(object, key_sequence);
            if (!!sub_key) {
              sequence_values.push(sub_key);
            }
          }, this);
          value = sequence_values;
        } else {
          var identifier_value = null;
          var key_identifiers = key_path.split('.');
          var key_identifier = key_identifiers[0];
          if (key_identifier in object) {
            var sub_object = object[key_identifier];
            if (key_identifiers.length == 1) {
              value = sub_object;
            } else {
              var remaining_key_path = key_identifiers.slice(1).join('.');
              identifier_value = self.keyExtraction(sub_object, remaining_key_path);
              if (!!identifier_value) {
                value = identifier_value;
              }
            }
          }
        } //indexOf
      } //length
      if (!value) {
        value = self.keyEmbellish(object);
      }
    } //typeof
    return value;
  },
  keyIsValid: function(key_value, every_index, every_array) {
    // http://www.w3.org/TR/IndexedDB/#key-construct
    // 'key_value' is "scalar" or Array value returned by 'keyExtraction', or not.
    // 'every_index' and 'every_array' are optional and only including for debugging array key values.
    // Returns whether 'key_value' is valid.
    var self = this;
    var key_values = ((key_value instanceof Array) ? (key_value) : ([key_value]));
    var key_is_valid = key_values.every(function every_key_is_valid(value, v, values) {
      var value_is_valid = false;
      if (value instanceof Date) {
        value_is_valid = !window.isNaN(value.getTime());
      } else if (typeof (value) === 'number') {
        value_is_valid = !window.isNaN(value);
      } else if (typeof (value) === 'string') {
        value_is_valid = true;
      } else if (value instanceof Array) {
        value_is_valid = value.every(self.keyIsValid, value);
      }
      return value_is_valid;
    }, key_values);
    return key_is_valid;
  },
  keyObjectComparator: function(key_path) {
    // http://www.w3.org/TR/IndexedDB/#key-construct
    // 'key_path' is optional, defaults to this 'keyPath'.
    // Returns comparator function to compare objects based on 'key_path'.
    var self = this;
    // Pre-default 'key_path's value for...sanity.
    key_path = key_path || self.keyPath;
    return function key_object_comparator(leftObj, rightObj) {
      var left_key = self.keyExtraction(leftObj, key_path);
      if (!self.keyIsValid(left_key)) {
        throw (new SyntaxError("keyObjectComparator: ".concat(
          "key value '", left_key, "' is invalid.  Evaluated using key path '", key_path, "'."
        )));
      }
      var right_key = self.keyExtraction(rightObj, key_path);
      if (!self.keyIsValid(right_key)) {
        throw (new SyntaxError("keyObjectComparator: ".concat(
          "key value '", right_key, "' is invalid.  Evaluated using key path '", key_path, "'."
        )));
      }
      var comparison = self.keyValueComparator()(left_key, right_key);
      // 'comparison' is already clamped to [-1,+1].
      return comparison;
    };
  },
  keyValueComparator: function() {
    // http://www.w3.org/TR/IndexedDB/#key-construct
    // Although no parameters are passed, it is a comparator factory to be analogous to 'keyObjectComparator'.
    var self = this;
    return function key_value_comparator(left_key, right_key) {
      var comparison = 0;
      var leftKeyIs = {
        'anArray': self.isArray(left_key),
        'aDate': left_key instanceof Date,
        'aNumber': typeof (left_key) === 'number',
        'aString': typeof (left_key) === 'string',
      };
      var rightKeyIs = {
        'anArray': self.isArray(right_key),
        'aDate': right_key instanceof Date,
        'aNumber': typeof (right_key) === 'number',
        'aString': typeof (right_key) === 'string',
      };
      if (leftKeyIs.anArray) {
        if (rightKeyIs.anArray) {
          comparison = right_key.length - left_key.length;
          if (comparison == 0) {
            // Use for-loop to facilitate 'break'.
            for (var i = 0, l = left_key.length; i < l; ++i) {
              var comp = self.keyValueComparator()(left_key[i], right_key[i]);
              if (comp != 0) {
                comparison = comp;break;
              }
            }
          }
        } else {
          comparison = -1;
        }
      } else if (leftKeyIs.aDate) {
        if (rightKeyIs.aDate) {
          comparison = right_key.getTime() - left_key.getTime();
        } else if (rightKeyIs.anArray) {
          comparison = +1;
        } else {
          comparison = Number.NaN;
        }
      } else if (leftKeyIs.aNumber) {
        if (rightKeyIs.aNumber) {
          comparison = right_key.valueOf() - left_key.valueOf();
        } else if (rightKeyIs.anArray || rightKeyIs.aDate) {
          comparison = +1;
        } else {
          comparison = Number.NaN;
        }
      } else if (leftKeyIs.aString) {
        if (rightKeyIs.aString) {
          comparison = left_key.localeCompare(right_key);
        } else if (rightKeyIs.anArray || rightKeyIs.aDate || rightKeyIs.aNumber) {
          comparison = +1;
        } else {
          comparison = Number.NaN;
        }
      } else {
        comparison = Number.NaN;
      }
      // Clamp comparison.
      comparison = Math.max(-1, Math.min(comparison, +1));
      return comparison;
    };
  }
});
Lawnchair.plugin({

  page: function(page, callback) {
    // some defaults
    var objs = [],
      count = 5, // TODO make this configurable
      cur = ~~page || 1,
      next = cur + 1,
      prev = cur - 1,
      start = cur == 1 ? 0 : prev * count,
      end = start >= count ? start + count : count

    // grab all the records
    // FIXME if this was core we could use this.__results for faster queries
    this.all(function(r) {
      objs = r
    })

    // grab the metadata
    var max = Math.ceil(objs.length / count),
      page = {
        max: max,
        next: next > max ? max : next,
        prev: prev == 0 ? 1 : prev
      }

    // reassign to the working resultset
    this.__results = page[this.name] = objs.slice(start, end)

    // callback / chain
    if (callback) this.fn('page', callback).call(this, page)
    return this
  }
});
// - NOT jsonPath or jsonQuery which are horrendously complex and fugly
// - simple query syntax 'its just javascript'
// - simple string interpolation
// - search then sorting
Lawnchair.plugin((function() {
  //
  var interpolate = function(template, args) {
    var parts = template.split('?').filter(function(i) {
        return i != ''
      }),
      query = ''

    for (var i = 0, l = parts.length; i < l; i++) {
      query += parts[i] + args[i]
    }
    return query
  }

  var sorter = function(p) {
    return function(a, b) {
      if (a[p] < b[p]) return -1
      if (a[p] > b[p]) return 1
      return 0
    }
  }
  //
  return {
    // query the storage obj
    where: function() {
      // ever notice we do this sort thing lots?
      var args = [].slice.call(arguments),
        tmpl = args.shift(),
        last = args[args.length - 1],
        qs = tmpl.match(/\?/g),
        q = qs && qs.length > 0 ? interpolate(tmpl, args.slice(0, qs.length)) : tmpl,
        is = new Function(this.record, 'return !!(' + q + ')'),
        r = [],
        cb
      // iterate the entire collection
      // TODO should we allow for chained where() to filter __results? (I'm thinking no b/c creates funny behvaiors w/ callbacks)
      this.all(function(all) {
        for (var i = 0, l = all.length; i < l; i++) {
          if (is.call(all[i], all[i])) r.push(all[i])
        }
        // overwrite working results
        this.__results = r
        // callback / chain
        if (args.length === 1) this.fn(this.name, last).call(this, this.__results)
      })
      return this
    },

    // FIXME should be able to call without this.__results
    // ascending sort the working storage obj on a property (or nested property)
    asc: function(property, callback) {
      this.fn(this.name, callback).call(this, this.__results.sort(sorter(property)))
      return this
    },

    // descending sort on working storage object on a property
    desc: function(property, callback) {
      this.fn(this.name, callback).call(this, this.__results.sort(sorter(property)).reverse())
      return this
    }
  }
/////
})());
