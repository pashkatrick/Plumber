const exec = require('child_process').exec;
const path = require('path')
const utf8 = require('utf8');
let resourcesURL = path.join(process.resourcesPath);

// TODO: metadata needed
var base_command = resourcesURL + '/grpcurl -plaintext '

class API {
    constructor() {
        this.users = 'https://jsonplaceholder.typicode.com/users';
        this.posts = 'https://jsonplaceholder.typicode.com/posts';
    }

    async sendRequest(host, method, req, metadata) {
        var command = `${base_command} -d '${req}' ${host} ${method}`
        var response = await this.__execute(command)
        return response = JSON.parse(response);
    }

    async messageTemplate(host, method, metadata) {
        var request = await this.__viewMethodRequest(host, method)
        var command = `${base_command} -msg-template ${host} describe ${request}`
        var response = await this.__execute(command)
        return JSON.parse(response.split('Message template:')[1].replace('\n', '').replace(' ', ''))
    }

    async __viewMethodRequest(host, method) {
        var command = `${base_command} ${host} describe ${method}`
        var response = await this.__execute(command)
        var lines = response.toString().split('\n');
        var out = utf8.decode(lines.join('')).replace(' ', '').replace(';', '')
        var request = out.split('returns')[0].split('(')[1].replace(')', '')
        return request
    }

    async methodList(host, metadata) {
        var methods = []
        var ss
        await this.serviceList(host).then(services => {
            ss = services
        })
        await this.__methodsFromServices(host, ss).then(resul => {
            methods = resul
        })
        return methods
    }

    async serviceList(host) {
        var command = `${base_command} ${host} list`
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
    async __methodsFromServices(host, services) {
        var result = []
        for (const service of services) {
            var methods = []
            var command = `${base_command} ${host} list ${service}`
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
