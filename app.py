from __future__ import print_function
import zerorpc
from core import RemoteServerController, DBController
from decouple import config

rs = RemoteServerController.RemoteServer(host=config('HOST'))
db = DBController.DBController(db=config('DB_NAME'))


class Api(object):

    def test(self):
        return 'Hello, World!'

    def service_list_handler(self):
        return rs.get_service_list()

    def method_list_handler(self):
        return rs.get_method_list(service=config('SERVICE'))

    def get_message_template_handler(self):
        return rs.get_message_template(method=config('TEST_METHOD'))

    def send_request_handler(self, req):
        return rs.send_request(req, config('TEST_METHOD'))

    def get_collections(self):
        return db.get_collections()

    def get_items_by_collection(self, id):
        return db.get_items_by_collection(id)

    def get_item(self, id):
        return db.get_item(id)


def __get_port():
    return config('RPC_PORT')


def main():
    addr = 'tcp://127.0.0.1:' + str(__get_port())
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()
