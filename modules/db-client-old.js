var sqlite3 = require('sqlite3').verbose();
const path = require('path')
let resourcesURL = path.join(process.resourcesPath);

// var db = new sqlite3.Database(resourcesURL + '/pony.db'); - тут надо думать
var db = new sqlite3.Database('pony.db');

// db.serialize(function() {});

// function add() {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }

//     stmt.finalize();
// }

// function read() {
//     var rows = document.getElementById("database");
//     db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//         console.log(row)
//     });
// }

// add()
// read()

class DB_API {
    constructor() {
        this.users = 'https://jsonplaceholder.typicode.com/users';
        this.posts = 'https://jsonplaceholder.typicode.com/posts';
    }

    sendRequest() {
        return 1
    }

    async getCollections() {
        var collections = []
        db.each("SELECT * FROM Сollection", function (err, row) {
            console.log(row)
            // var _collection = {
            //     id: row.Id,
            //     name: row.Name
            // }
            // collections.push(_collection)
        });

        return collections
    }

    async getItem(itemId) {
        // var collections = []
        // db.each("SELECT * FROM Сollection", (err, row) => {

        //     var _collection = {
        //         id: row.Id,
        //         name: row.Name
        //     }
        //     collections.push(_collection)
        // });
        // db.close()
        // return collections
    }
}

module.exports = DB_API;



// Object.freeze(API)

// const API = {

//     // COLLECTIONS
//     get_collections: (callback) => {
//         client.invoke("get_collections_handler", (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
//     add_collection: (name, callback) => {
//         client.invoke("add_collection_handler", name, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
//     remove_collection: (id, callback) => {
//         client.invoke("remove_collection_handler", id, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
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
//     export_collections: (callback) => {
//         client.invoke("export_handler", (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
//     import_collections: (collections, callback) => {
//         client.invoke("import_handler", collections, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
//     // ITEMS
//     get_item: (id, callback) => {
//         client.invoke("get_item_handler", id, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
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
//     add_item: (object, callback) => {
//         client.invoke("add_item_handler", object, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     },
//     remove_item: (id, callback) => {
//         client.invoke("remove_item_handler", id, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return null
//             } else {
//                 callback(result)
//             }
//         })
//     }
// }

