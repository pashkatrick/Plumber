from flask import Flask
from core import RemoteServerController

from decouple import config
app = Flask(__name__)
rs = RemoteServerController.RemoteServer(host=config('HOST'))


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/service_list')
def service_list_handler():
    return rs.get_service_list()


@app.route('/method_list')
def method_list_handler():
    return rs.get_method_list(service=config('SERVICE'))


@app.route('/get_message_template')
def get_message_template_handler():
    return rs.get_message_template(method=config('TEST_METHOD'))


@app.route('/get_message_schema')
def get_message_schema_handler():
    return rs.get_message_schema(method=config('TEST_METHOD'))


@app.route('/send_request')
def send_request_handler():
    req = config('TEST_REQUEST')
    return rs.send_request(req, config('TEST_METHOD'))


@app.route('/export')
def export_handler():
    pass


@app.route('/import')
def import_handler():
    pass


@app.route('/build_config')
def build_config_handler():
    pass


if __name__ == '__main__':
    app.run(debug=False, port=3535, host='127.0.0.1')
