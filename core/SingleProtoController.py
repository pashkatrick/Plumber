import json
import subprocess


class SingleProtoController:

    def __init__(self, host, path):
        self.host = host
        self.file = path.split('/')[-1]
        self.folder = path.split(self.file)[0]

    def __get_service_list(self):
        command = './grpcurl -import-path %s -proto %s list' % (self.folder, self.file)
        output = subprocess.check_output(command, shell=True)
        service_list = [service for service in output.decode('utf-8').split('\n') if service]
        return dict(services=service_list)

    def get_method_list(self):
        services = self.__get_service_list()['services']
        result = []
        for service in services:
            command = './grpcurl -import-path %s -proto %s list %s' % (self.folder, self.file, service)
            output = subprocess.check_output(command, shell=True)
            method_list = [method for method in output.decode('utf-8').split('\n') if method]
            result.append(dict(service=service, methods=method_list))
        return dict(methods=result)

    def __get_message_schema(self, method):
        command = './grpcurl -import-path %s -proto %s describe %s' % (self.folder, self.file, method)
        output = subprocess.check_output(command, shell=True)
        out = output.decode('utf-8').replace('\n', '').replace(' ', '').replace(';', '')
        res = out.split('returns')[1].replace('(', '').replace(')', '')
        req = out.split('returns')[0].split('(')[1].replace(')', '')
        schema = dict(request=req, response=res)
        return schema

    def get_message_template(self, method):
        request = self.__get_message_schema(method)['request']
        command = './grpcurl -msg-template -import-path %s -proto %s describe %s' % (self.folder, self.file, request)
        output = subprocess.check_output(command, shell=True)
        message_template = json.loads(output.decode('utf8').split('Message template:')[1].replace('\n', '').replace(' ', ''))
        return message_template

    def view_method_scheme(self, method):
        data = self.__get_message_schema(method)
        command_request = './grpcurl -msg-template -import-path %s -proto %s describe %s' % (self.folder, self.file, data['request'])
        command_response = './grpcurl -msg-template -import-path %s -proto %s describe %s' % (self.folder, self.file, data['response'])
        output_request = subprocess.check_output(command_request, shell=True)
        output_response = subprocess.check_output(command_response, shell=True)
        scheme = output_request.decode('utf8') + '\n' + output_response.decode('utf8')
        return scheme
