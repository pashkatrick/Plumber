import json
import subprocess


class RemoteServer:

    def __init__(self, host):
        self.host = host

    def get_service_list(self):
        command = 'grpcurl -plaintext {} list'.format(self.host)
        output = subprocess.check_output(command, shell=True)
        service_list = [service for service in output.decode('utf-8').split('\n') if service]
        return dict(services=service_list)

    def get_method_list(self, service):
        command = 'grpcurl -plaintext {} list {}'.format(self.host, service)
        output = subprocess.check_output(command, shell=True)
        method_list = [method for method in output.decode('utf-8').split('\n') if method]
        return dict(methods=method_list)

    def get_message_schema(self, method):
        command = 'grpcurl -plaintext {} describe {}'.format(self.host, method)
        template = subprocess.check_output(command, shell=True)
        out = template.decode('utf-8').replace('\n', '').replace(' ', '').replace(';', '')
        res = out.split('returns')[1].replace('(', '').replace(')', '')
        req = out.split('returns')[0].split('(')[1].replace(')', '')
        schema = dict(request=req, response=res)
        return schema

    def get_message_template(self, method):
        request = self.get_message_schema(method)['request']
        command = 'grpcurl -plaintext -msg-template {} describe {}'.format(self.host, request)
        template = subprocess.check_output(command, shell=True)
        message_template = json.loads(template.decode('utf8').split('Message template:')[1].replace('\n', '').replace(' ', ''))
        return message_template
