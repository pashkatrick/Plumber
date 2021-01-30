import pytest
import os, sys
import subprocess
from subprocess import Popen


@pytest.mark.usefixtures('run_server')
class TestClass:
    def test_base_command(self):
        command = 'zerorpc tcp://localhost:3535 test'
        output = subprocess.check_output(command, shell=True).decode('utf-8').split('\n')[0]
        assert output == 'Success!'

    def test_quest(self):
        assert 4 == 4


@pytest.fixture(scope='session')
def run_server():
    process = Popen(["python3", "app.py"])
    yield
    process.kill()
