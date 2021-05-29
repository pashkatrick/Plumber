const exec = require('child_process').exec;
const path = require('path')
const utf8 = require('utf8');
let resourcesURL = path.join(process.resourcesPath);

// TODO: metadata needed
var base_command = resourcesURL + '/grpcurl -plaintext '

const API = {

    execution: (command, callback) => {

    },

    service_list: (host, callback) => {

        command = `${base_command} ${host} list`
        exec(command, function (error, stdout, stderr) {
            if (error) {
                console.log('err: ' + error)
            } else if (stdout) {
                var lines = stdout.toString().split('\n');
                var result = new Array();
                lines.forEach(function (line) {
                    if (line != '') {
                        result.push(line)
                    }
                });
                callback(result)

            } else {
                console.log('stderr: ' + stderr)
            }
        });
    },

    method_list: (host, callback) => {

        services = API.service_list(host, (services) => {
            var result = []
            services.forEach(function (service) {
                var methods = new Array()
                var _service = {}
                command = `${base_command} ${host} list ${service}`
                exec(command, function (error, stdout, stderr) {
                    var lines = stdout.toString().split('\n');
                    lines.forEach(function (line) {
                        if (line != '') {
                            methods.push(line)
                        }
                    });

                });
                _service.methods = methods
                _service.service = service
                result.push(_service)
            });
            callback(result)
        })
    },
    view_method_scheme: (host, method, callback) => {

        command = `${base_command} ${host} describe ${method}`

        exec(command, function (error, stdout, stderr) {
            var lines = stdout.toString().split('\n');

            var out = utf8.decode(lines.join(''))
            out = out.replace(';', '')
            // lines.forEach(function (line) {
            //     if (line != '') {

            //     }
            // });
            // var out = utf8.decode(stdout).replace('\n', '')
            // var b = out.replace(' ', '')
            // var c = b.replace(';', '')
            console.log(out)
        });


        // function decode_utf8( s )
        //     {
        //     return decodeURIComponent( escape( s ) );

        // client.invoke("view_method_scheme_handler", host, method, metadata, (error, result) => {
        //     if (error) {
        //         console.log(error)
        //         return null
        //     } else {
        //         callback(result)
        //     }
        // })
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
    // view_method_scheme: (host, method, metadata, callback) => {
    //     client.invoke("view_method_scheme_handler", host, method, metadata, (error, result) => {
    //         if (error) {
    //             console.log(error)
    //             return null
    //         } else {
    //             callback(result)
    //         }
    //     })
    // },
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
