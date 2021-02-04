const zerorpc = require('zerorpc')
const config = require('./config')

// Create zerorpc client
let client = new zerorpc.Client()

// Connect to the zerorpc server which is run in python
client.connect("tcp://" + config.ZERORPC_HOST
    + ":" + config.ZERORPC_PORT)

const API = {
    test: (callback) => {
        client.invoke("test", (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    message_template: (host, method, callback) => {
        client.invoke("get_message_template_handler", host, method, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                console.log(error)
                callback(result)
            }
        })
    },
    send_request: (host, method, req, callback) => {
        client.invoke("send_request_handler", host, method, req, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    method_list: (host, callback) => {
        client.invoke("method_list_handler", host, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    service_list: (host, callback) => {
        client.invoke("service_list_handler", host, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    view_method_scheme: (host, method, callback) => {
        client.invoke("view_method_scheme_handler", host, method, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    // COLLECTIONS
    get_collections: (callback) => {
        client.invoke("get_collections_handler", (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    add_collection: (name, callback) => {
        client.invoke("add_collection_handler", name, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    remove_collection: (id, callback) => {
        client.invoke("remove_collection_handler", id, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    update_collection: (object, callback) => {
        client.invoke("update_collection_handler", object, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    export_collections: (path, callback) => {
        client.invoke("export_handler", path, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    import_collections: (path, callback) => {
        client.invoke("import_handler", path, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    // ITEMS
    get_item: (id, callback) => {
        client.invoke("get_item_handler", id, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    update_item: (object, callback) => {
        client.invoke("update_item_handler", object, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    add_item: (object, callback) => {
        client.invoke("add_item_handler", object, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    remove_item: (id, callback) => {
        client.invoke("remove_item_handler", id, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    }
}

Object.freeze(API)
module.exports = { API }
