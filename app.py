from __future__ import print_function
import zerorpc
from core import RemoteServerController
from decouple import config

rs = RemoteServerController.RemoteServer(host=config('HOST'))


class Api(object):

    def hello_world(self):
        return 'Hello, World!'

    def service_list_handler(self):
        return rs.get_service_list()

    def method_list_handler(self):
        return rs.get_method_list(service=config('SERVICE'))

    def get_message_template_handler(self):
        return rs.get_message_template(method=config('TEST_METHOD'))

    def get_message_schema_handler(self):
        return rs.get_message_schema(method=config('TEST_METHOD'))

    def send_request_handler(self):
        req = config('TEST_REQUEST')
        return rs.send_request(req, config('TEST_METHOD'))

    def export_handler():
        pass

    def import_handler():
        pass

    def build_config_handler():
        pass


def _get_port():
    return config('RPC_PORT')


def main():
    addr = 'tcp://127.0.0.1:' + str(_get_port())
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()
