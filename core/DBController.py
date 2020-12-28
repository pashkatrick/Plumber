from pony import orm
from pony.orm import db_session
from core.models import collection, item


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

            result.append(dict(collection=col.Name, items=items))
        return dict(collections=result)

    @db_session
    def get_items_by_collection(self, collection_id):
        c = list(self.collection_model.select(lambda col: col.Id == collection_id))[0]
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
            collection=i[0].Collection_id
        )

    @db_session
    def add_item(self, name, host, method, request_body, collection_id):
        return self.item_model(
            Name=name,
            Host=host,
            Method=method,
            Request=request_body,
            Collection_id=collection_id
        )

    @db_session
    def add_collection(self, name):
        return self.collection_model(
            Name=name
        )

    @db_session
    def remove_item(self, item_id):
        i = self.item_model.select(lambda item: item.id == item_id)
        i.delete()

    @db_session
    def remove_collection(self, collection_id):
        c = self.collection_model.select(lambda item: item.id == collection_id)
        c.delete()

    @db_session
    def export_collections(self):
        pass

    @db_session
    def export_collection(self, collection_id):
        pass

    @db_session
    def update_query(self):
        pass
