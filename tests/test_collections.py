import pytest
import os
import sys
import subprocess
from subprocess import Popen
import json
from decouple import config


@pytest.fixture(scope='class')
def run_server():
    process = Popen(["python3", "app.py"])
    yield
    process.kill()


@pytest.mark.usefixtures('run_server')
class TestCollections:

    def test_get_collections_handler(self):
        pass

    def test_update_collection_handler(self):
        pass

    def test_add_collection_handler(self):
        pass

    def test_remove_collection_handler(self):
        pass
