import pony.orm.dbproviders.sqlite
from pony import orm
from pony.orm import db_session
from core.models import collection, item
import json


class DBController:

    def __init__(self, db):
        self.db = orm.Database()
        self.db.bind(provider='sqlite', filename=db, create_db=True)
        self.collection_model = collection(self.db, orm)
        self.item_model = item(self.db, orm, self.collection_model)
        self.db.generate_mapping(create_tables=True)

    @db_session
    def get_collections(self):
        collections = list(self.collection_model.select())
        result = []
        for col in collections:
            items = []
            for i in list(self.item_model.select(lambda item: item.Collection_id == col)):
                items.append(self.get_item(i.Id))
            result.append(dict(id=col.Id, collection=col.Name, items=items))
        return dict(collections=result)

    @db_session
    def get_items_by_collection(self, collection_id):
        c = list(self.collection_model.select(
            lambda col: col.Id == collection_id))[0]
        items = []
        for i in list(self.item_model.select(lambda item: item.Collection_id == c)):
            items.append(self.get_item(i.Id))
        return dict(collection=c.Id, items=items)

    @db_session
    def get_item(self, item_id):
        i = list(self.item_model.select(lambda item: item.Id == item_id))
        return dict(
            id=i[0].Id,
            name=i[0].Name,
            host=i[0].Host,
            method=i[0].Method,
            request=i[0].Request,
            collection=i[0].Collection_id.Id
        )

    @db_session
    def add_item(self, __object):
        obj = json.loads(__object)
        return self.item_model(
            Name=obj['name'],
            Host=obj['host'],
            Method=obj['method'],
            Request=obj['request_body'],
            Collection_id=obj['collection_id']
        )

    @db_session
    def add_collection(self, name):
        return self.collection_model(
            Name=name
        )

    @db_session
    def remove_item(self, item_id):
        i = list(self.item_model.select(lambda item: item.Id == item_id))
        i[0].delete()

    @db_session
    def remove_collection(self, collection_id):
        c = list(self.collection_model.select(
            lambda item: item.Id == collection_id))
        c[0].delete()

    @db_session
    def update_item(self, __object):
        obj = json.loads(__object)
        i = list(self.item_model.select(
            lambda item: item.Id == obj['item_id']))
        return i[0].set(
            Name=obj['name'],
            Host=obj['host'],
            Method=obj['method'],
            Request=obj['request_body'],
            Collection_id=obj['collection_id']
        )

    @db_session
    def update_collection(self, __object):
        obj = json.loads(__object)
        i = list(self.collection_model.select(
            lambda col: col.Id == obj['collection_id']))
        return i[0].set(
            Name=obj['name']
        )

    @db_session
    def export_collections(self, path):
        obj = self.get_collections()
        with open(path, 'w') as fp:
            json.dump(obj, fp, indent=4)
            return 'ok'

    def import_collections(self, path):
        with open(path) as f:
            content_to_import = json.load(f)
        for col in content_to_import['collections']:
            self.add_collection(col['collection'])
            for query in col['items']:
                obj = dict(
                    name=query['name'],
                    host=query['host'],
                    method=query['method'],
                    request_body=query['request'],
                    collection_id=col['id']
                )
                self.add_item(json.dumps(obj))
        return 'ok'
