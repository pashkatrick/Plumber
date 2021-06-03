// let resourcesURL = path.join(process.resourcesPath);
const Store = require('./store.js');

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
    constructor() {
        this.users = 'https://jsonplaceholder.typicode.com/users';
        this.posts = 'https://jsonplaceholder.typicode.com/posts';
    }

    addCollection(collectionName) {
        var collections = this.getCollections()
        var newCount = this.__getCollectionsCount() + 1
        collections.push({ collection: collectionName, id: newCount })
        store.set('collections', collections)
        this.__setCollectionsCount(newCount)
    }

    addItem(collectionId, object) {
        var doc = this.getCollections()
        var response
        doc.forEach(function (collection) {
            if (collection.id === collectionId) {
                var newCount = this.__getItemsCount() + 1
                object.id = newCount
                collection.items.push(object)
                store.set('collections', doc)
                this.__setItemsCount(newCount)
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

    async getItem(itemId) {
        return await new Promise(resolve => {
            var doc = this.getCollections()
            doc.forEach(function (collection) {
                collection.items.forEach(function (item) {
                    if (item.id === itemId) {
                        resolve(item)
                    }
                })
            });
        })
    }

    // getItem(itemId) {
    //     var doc = this.getCollections()
    //     var response
    //     doc.forEach(function (collection) {
    //         collection.items.forEach(function (item) {
    //             if (item.id === itemId) {
    //                 response = item
    //             }
    //         })
    //     });
    //     return response
    // }

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
            collection.items.forEach(function (item) {
                if (item.id === itemId) {
                    collection.items.remove(item)
                    response = item.id
                }
            })
        });
        return response
    }

    updateCollections() {

    }

    updateCollections() {

    }

    importCollections(file) {

    }

    exportCollections(path) {

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



// Object.freeze(API)

// const API = {

//     update_collection: (object, callback) => {
//         client.invoke("update_collection_handler", object, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
//     // ITEMS
//     update_item: (object, callback) => {
//         client.invoke("update_item_handler", object, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
// }

