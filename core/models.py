def collection(db, orm):
    class Collection(db.Entity):
        id = orm.PrimaryKey(int, auto=True)
        Name = orm.Optional(str, 100)
        queries = orm.Set('Query')
    return Collection


def query(db, orm, Collection):
    class Query(db.Entity):
        id = orm.PrimaryKey(int, auto=True)
        Name = orm.Optional(str)
        Host = orm.Optional(str)
        Method = orm.Optional(str)
        Request = orm.Optional(str)
        Collection_id = orm.Required(Collection)
    return Query
