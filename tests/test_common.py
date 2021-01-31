import pytest
import subprocess
from subprocess import Popen
from decouple import config


@pytest.fixture(scope='class')
def run_server():
    process = Popen(['python3', 'app.py'])
    yield
    process.kill()


@pytest.mark.usefixtures('run_server')
class TestCommon:
    test_host = config('TEST_HOST')
    host = config('HOST')
    method = config('METHOD')
    service = config('SERVICE')
    cmd = 'zerorpc ' + test_host

    def test_base_command(self):
        command = self.cmd + ' test'
        output = subprocess.check_output(command, shell=True).decode(
            'utf-8').split('\n')[0].replace('"', '')
        assert output == "'Success!'"

    def test_method_list_handler(self):
        command = self.cmd + ' method_list_handler %s' % (self.host)
        output = subprocess.check_output(command, shell=True).decode('utf-8')
        assert output != ''

    def test_get_message_template_handler(self):
        command = self.cmd + \
            ' get_message_template_handler %s %s' % (self.host, self.method)
        output = subprocess.check_output(command, shell=True).decode('utf-8')
        assert output != ''

    def test_send_request_handler(self):
        pass

    def test_view_method_scheme_handler(self):
        pass

    def test_export_handler(self):
        pass

    def test_import_handler(self):
        pass
