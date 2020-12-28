def collection(db, orm):
    class Collection(db.Entity):
        Id = orm.PrimaryKey(int, auto=True)
        Name = orm.Optional(str, 100)
        queries = orm.Set('Item')
    return Collection


def item(db, orm, Collection):
    class Item(db.Entity):
        Id = orm.PrimaryKey(int, auto=True)
        Name = orm.Optional(str)
        Host = orm.Optional(str)
        Method = orm.Optional(str)
        Request = orm.Optional(str)
        Collection_id = orm.Required(Collection)
    return Item
