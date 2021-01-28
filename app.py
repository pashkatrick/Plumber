from __future__ import print_function
import zerorpc
from core import RemoteServerController, DBController
from decouple import config

# TODO: может ломать сборку 
db = DBController.DBController(db=config('DB_NAME'))


class Api(object):

    def test(self):
        return 'Hello, World!'

    def method_list_handler(self, host):
        rs = RemoteServerController.RemoteServer(host=host)
        return rs.get_method_list()

    def get_message_template_handler(self, host, method):
        rs = RemoteServerController.RemoteServer(host=host)
        return rs.get_message_template(method=method)

    def send_request_handler(self, host, method, req):
        rs = RemoteServerController.RemoteServer(host=host)
        return rs.send_request(request=req, method=method)

    def view_method_scheme_handler(self, host, method):
        rs = RemoteServerController.RemoteServer(host=host)
        return rs.view_method_scheme(method=method)

    def get_collections_handler(self):
        return db.get_collections()

    def update_collection_handler(self, __object):
        return db.update_collection(__object)

    def add_collection_handler(self, name):
        return db.add_collection(name=name).Id

    def remove_collection_handler(self, id):
        return db.remove_collection(collection_id=id)

    def get_item_handler(self, id):
        return db.get_item(item_id=id)

    def add_item_handler(self, __object):
        return db.add_item(__object).Id

    def update_item_handler(self, __object):
        return db.update_item(__object)

    def remove_item_handler(self, id):
        return db.remove_item(item_id=id)

    def get_items_by_collection_handler(self, id):
        return db.get_items_by_collection(collection_id=id)

    def export_handler(self):
        return db.export_collections(path=config('EXPORT'))

    def import_handler(self):
        return db.import_collections(path=config('IMPORT'))


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
