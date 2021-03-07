import json
import subprocess


class RemoteServer:

    def __init__(self, host):
        self.host = host

    def __get_service_list(self, path):
        command = '%s -plaintext %s list' % (path, self.host)
        output = subprocess.check_output(command, shell=True)
        service_list = [service for service in output.decode('utf-8').split('\n') if service]
        return dict(services=service_list)

    def get_method_list(self, path):
        services = self.__get_service_list(path)['services']
        result = []
        for service in services:
            command = '%s -plaintext %s list %s' % (path, self.host, service)
            output = subprocess.check_output(command, shell=True)
            method_list = [method for method in output.decode('utf-8').split('\n') if method]
            result.append(dict(service=service, methods=method_list))
        return dict(methods=result)

    def __get_message_schema(self, method):
        command = './grpcurl -plaintext %s describe %s' % (self.host, method)
        output = subprocess.check_output(command, shell=True)
        out = output.decode('utf-8').replace('\n', '').replace(' ', '').replace(';', '')
        res = out.split('returns')[1].replace('(', '').replace(')', '')
        req = out.split('returns')[0].split('(')[1].replace(')', '')
        schema = dict(request=req, response=res)
        return schema

    def get_message_template(self, method):
        request = self.__get_message_schema(method)['request']
        command = './grpcurl -plaintext -msg-template %s describe %s' % (self.host, request)
        output = subprocess.check_output(command, shell=True)
        message_template = json.loads(output.decode('utf8').split('Message template:')[1].replace('\n', '').replace(' ', ''))
        return message_template

    def send_request(self, request, method):
        command = './grpcurl -plaintext -d \'%s\' %s %s' % (request, self.host, method)
        output = subprocess.check_output(command, shell=True)
        return json.loads(output.decode('utf-8'))

    def view_method_scheme(self, method):
        data = self.__get_message_schema(method)
        command_request = './grpcurl -plaintext -msg-template %s describe %s' % (self.host, data['request'])
        command_response = './grpcurl -plaintext -msg-template %s describe %s' % (self.host, data['response'])
        output_request = subprocess.check_output(command_request, shell=True)
        output_response = subprocess.check_output(command_response, shell=True)
        scheme = output_request.decode('utf8') + '\n' + output_response.decode('utf8')
        return scheme
