/*
CONFIGURATION CONSTANTS
*/

/** Should debug output be printed? */
let DEBUG = false

/** Host to use for the zerorpc server */
let ZERORPC_HOST = "0.0.0.0"

/** Port to use for the zerorpc server */
let ZERORPC_PORT = 3535

// Export the API
module.exports = {
    DEBUG,
    ZERORPC_HOST,
    ZERORPC_PORT
}
