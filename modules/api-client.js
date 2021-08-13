const exec = require('child_process').exec;
const path = require('path')
const utf8 = require('utf8');
let resourcesURL = path.join(process.resourcesPath);

var base_command = resourcesURL + '/grpcurl -plaintext '

class API {
    constructor() { }

    async sendRequest(host, port, method, req, metadata) {
        var rpcHeaders = []
        var command
        if (metadata) {
            json_meta = JSON.parse(metadata)
            json_meta.forEach((header) => {
                rpcHeaders.push(`-rpc-header ~${header}:${json_meta[header]}`)
            })
            command = `${base_command} ${rpcHeaders} -d '${req}' ${host}${port} ${method}`
        } else {
            command = `${base_command} -d '${req}' ${host}${port} ${method}`
        }
        var response = await this.__execute(command)
        return response = JSON.parse(response);
    }

    async messageTemplate(host, port, method) {
        var request = await this.__viewMethodRequest(host, port, method)
        var command = `${base_command} -msg-template ${host}${port} describe ${request}`
        var response = await this.__execute(command)
        return JSON.parse(response.split('Message template:')[1].replace('\n', '').replace(' ', ''))
    }

    async __viewMethodRequest(host, port, method) {
        var command = `${base_command} ${host}${port} describe ${method}`
        var response = await this.__execute(command)
        var lines = response.toString().split('\n');
        var out = utf8.decode(lines.join('')).replace(' ', '').replace(';', '')
        var request = out.split('returns')[0].split('(')[1].replace(')', '')
        return request
    }

    async methodList(host, port) {
        var methods = []
        var ss
        await this.serviceList(host, port).then(services => {
            ss = services
        })
        await this.__methodsFromServices(host, port, ss).then(resul => {
            methods = resul
        })
        return methods
    }

    async serviceList(host, port) {
        var command = `${base_command} ${host}${port} list`
        var services = []
        var res = await this.__execute(command)
        var lines = res.toString().split('\n');
        lines.forEach(function (line) {
            if (line != '') {
                services.push(line)
            }
        });
        return services
    }

    async __execute(command) {
        return await new Promise(resolve => {
            exec(command, function (error, stdout, stderr) {
                if (error) {
                    console.log('err: ' + error)
                } else if (stdout) {
                    resolve(stdout)
                } else {
                    console.log('stderr: ' + stderr)
                }
            })
        })
    }
    async __methodsFromServices(host, port, services) {
        var result = []
        for (const service of services) {
            var methods = []
            var command = `${base_command} ${host}${port} list ${service}`
            var res = await this.__execute(command)
            var lines = res.toString().split('\n');
            lines.forEach(function (line) {
                if (line != '') {
                    methods.push(line)
                }
            });
            var _service = {
                methods: methods,
                service: service
            }
            result.push(_service)
        }
        return result
    }
}

module.exports = API;
