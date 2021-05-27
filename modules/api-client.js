const API = {
    test: (callback) => {
        client.invoke("test", (error, result) => {
            if (error) {
                console.log(error)
                // docker need message
                document.querySelector('#dockerless').style.display = 'block'
                return null
            } else {
                callback(result)
            }
        })
    },
    message_template: (host, method, metadata, callback) => {
        client.invoke("get_message_template_handler", host, method, metadata, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                console.log(error)
                callback(result)
            }
        })
    },
    send_request: (host, method, req, metadata, callback) => {
        client.invoke("send_request_handler", host, method, req, metadata, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    method_list: (host, metadata, callback) => {
        client.invoke("method_list_handler", host, metadata, (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    view_method_scheme: (host, method, metadata, callback) => {
        client.invoke("view_method_scheme_handler", host, method, metadata, (error, result) => {
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
    export_collections: (callback) => {
        client.invoke("export_handler", (error, result) => {
            if (error) {
                console.log(error)
                return null
            } else {
                callback(result)
            }
        })
    },
    import_collections: (collections, callback) => {
        client.invoke("import_handler", collections, (error, result) => {
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
