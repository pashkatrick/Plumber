import pytest
from subprocess import Popen


@pytest.fixture(scope='class')
def run_server():
    process = Popen(['python3', 'app.py'])
    yield
    process.kill()


@pytest.mark.usefixtures('run_server')
class TestItems:

    def test_get_item_handler(self):
        pass

    def test_add_item_handler(self):
        pass

    def test_update_item_handler(self):
        pass

    def test_remove_item_handler(self):
        pass

    def test_get_items_by_collection_handler(self):
        pass
