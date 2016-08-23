/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	function _getItem(keyName, callback, error) {
		DronaHQ.KVStore.getItem(keyName, function(data){
			callback(data.value);
		}, function(e){
			if(typeof error === 'function'){
				error(e);
			}
		});
	};

	function _setItem(keyName, value, callback) {
		DronaHQ.KVStore.setItem(keyName, value, callback, function(e){console.error(e)});
	};

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @param {string} name The name of our DB we want to use
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		function _callback(value) {
			callback.call(this, JSON.parse(value));
		};

		function _error() {
			var data = {
				todos: []
			};

			var strData = JSON.stringify(data);

			_setItem(name, strData, function() {
				callback.call(this, strData);	
			});
			
		};

		_getItem(name, _callback.bind(this), _error);
	}

	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback	 The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		function _callback(value) {
			var todos = JSON.parse(value).todos;

			callback.call(this, todos.filter(function (todo) {
				for (var q in query) {
					if (query[q] !== todo[q]) {
						return false;
					}
				}
				return true;
			}));
		};

		_getItem(this._dbName, _callback.bind(this));
	};

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		
		function _callback(value) {
			callback.call(this, JSON.parse(value).todos);	
		};
		
		_getItem(this._dbName, _callback.bind(this));
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object} updateData The data to save back into the DB
	 * @param {function} callback The callback to fire after saving
	 * @param {number} id An optional param to enter an ID of an item to update
	 */
	Store.prototype.save = function (updateData, callback, id) {
		
		function _callback(value) {
			var data = 	JSON.parse(value);		
			var todos = data.todos;

			callback = callback || function () {};

			// If an ID was actually given, find the item and update each property
			if (id) {
				for (var i = 0; i < todos.length; i++) {
					if (todos[i].id === id) {
						for (var key in updateData) {
							todos[i][key] = updateData[key];
						}
						break;
					}
				}

				_setItem(this._dbName, JSON.stringify(data), function() {
					callback.call(this, data.todos);
				});
			} else {
				// Generate an ID
				updateData.id = new Date().getTime();

				todos.push(updateData);
				_setItem(this._dbName, JSON.stringify(data), function(){
					callback.call(this, [updateData]);
				});
				
			}
		};

		_getItem(this._dbName, _callback.bind(this));
	};

	/**
	 * Will remove an item from the Store based on its ID
	 *
	 * @param {number} id The ID of the item you want to remove
	 * @param {function} callback The callback to fire after saving
	 */
	Store.prototype.remove = function (id, callback) {

		function _callback(value) {
			var data = JSON.parse(value);
			var todos = data.todos;

			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id == id) {
					todos.splice(i, 1);
					break;
				}
			}

			_setItem(this._dbName, JSON.stringify(data), function() {
				callback.call(this, data.todos);	
			});			
		};

		_getItem(this._dbName, _callback.bind(this));
	};

	/**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		_setItem(this._dbName, JSON.stringify({todos: []}), function(){
			callback.call(this, []);
		});

		
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
