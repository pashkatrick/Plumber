const Store = require('./store.js');
const path = require('path');
const fs = require('fs');

const store = new Store({
    configName: 'collections'
});

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

class DB_API {
    constructor() {}

    addCollection(collectionName) {
        var collections = this.getCollections()
        var newCount = this.__getCollectionsCount() + 1
        collections.push({ collection: collectionName, id: newCount, items: [] })
        store.set('collections', collections)
        this.__setCollectionsCount(newCount)
        return newCount
    }

    addItem(collectionId, object) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            if (collection.id === collectionId) {
                // var newCount = this.__getItemsCount() + 1
                var newCount = doc.length + 1
                object.id = newCount
                collection.items.push(object)
                store.set('collections', doc)
                // this.__setItemsCount(newCount)
                response = newCount
            }
        });
        return response
    }

    getCollections() {
        return store.get('collections')
    }

    getItemsByCollection(collectionId) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            if (collection.id === collectionId) {
                response = collection.items
            }
        });
        return response
    }

    getItem(itemId) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            collection.items.forEach(function (item) {
                if (item.id === itemId) {
                    response = item
                }
            })
        });
        return response
    }

    removeCollection(collectionId) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            if (collection.id === collectionId) {
                doc.remove(collection)
                store.set('collections', doc)
                response = collection.id
            }
        });
        return response
    }

    removeItem(itemId) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            var __items = collection.items
            __items.forEach(function (item) {
                if (item.id === itemId) {
                    __items.remove(item)
                    // __items.push(object)
                    store.set('collections', doc)
                    response = item.id
                }
            })
        });
        return response
    }

    updateCollection(object) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            var _id = parseInt(object.collection_id)
            if (collection.id === _id) {
                var __newCol = {
                    collection: object.name,
                    id: _id,
                    items: collection.items
                }
                doc.remove(collection)
                doc.push(__newCol)
                store.set('collections', doc)
                response = __newCol.id
            }
        });
        return response
    }

    updateItem(object) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            var __items = collection.items
            __items.forEach(function (item) {
                if (item.id === object.id) {
                    console.log(object)
                    __items.remove(item)
                    __items.push(object)
                    store.set('collections', doc)
                    response = item.id
                }
            })
        });
        return response
    }

    importCollections(file) {

    }

    exportCollections(path) {
        store.export(path)
    }

    __setItemsCount(count) {
        return store.set('itemsCount', count)
    }

    __setCollectionsCount(count) {
        return store.set('collectionsCount', count)
    }

    __getItemsCount() {
        return store.get('itemsCount')
    }

    __getCollectionsCount() {
        return store.get('collectionsCount')
    }
}

module.exports = DB_API;


