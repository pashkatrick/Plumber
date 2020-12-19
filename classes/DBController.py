import sqlite3


class DBController:

    # TODO: убрать это ваще всё :peka
    def __init__(self, db='tutorial.db'):
        self.db = sqlite3.connect(db)
        self.cursor = self.db.cursor()

    # TODO: убрать после проверки
    # def get_tables(self):
    #     self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    #     print(self.cursor.fetchall())

    def add_query(self, name, collection_id, host, method, request_body):
        values = (None, name, collection_id, host, method, request_body)
        self.cursor.execute('INSERT INTO queries VALUES (?,?,?,?,?,?);', values)
        self.db.commit()
        query_id = self.cursor.lastrowid
        return query_id

    def add_collection(self, name):
        self.cursor.execute('INSERT INTO collections VALUES (?,?);', (None, name))
        self.db.commit()
        collection_id = self.cursor.lastrowid
        return collection_id

    def update_query(self, query_id):
        pass

    def remove_query(self, query_id):
        self.cursor.execute('DELETE FROM queries WHERE id = %s ' % query_id)
        self.db.commit()
        return query_id

    def remove_collection(self, collection_id):
        self.cursor.execute('DELETE FROM collections WHERE id = %s ' % collection_id)
        self.db.commit()
        return collection_id

    def export_collection(self, collection_id):
        pass

    def export_collections(self):
        pass
