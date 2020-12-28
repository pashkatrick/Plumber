from pony import orm
from pony.orm import db_session
from core.models import collection, query


class DBController:

    def __init__(self, db):
        self.db = orm.Database()
        self.db.bind(provider='sqlite', filename=db, create_db=True)
        self.collection_model = collection(self.db, orm)
        self.query_model = query(self.db, orm, self.collection_model)
        self.db.generate_mapping(create_tables=True)

    @db_session
    def get_collections(self):
        pass

    @db_session
    def get_items_by_collection(self, id):
        pass

    @db_session
    def get_item(self, id):
        pass

    @db_session
    def add_query(self, name, host, method, request_body, collection_id):
        return self.query_model(
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
    def remove_query(self, query_id):
        q = self.query_model.select(lambda item: item.id == query_id)
        q.delete()

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
