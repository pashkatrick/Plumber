from flask import Flask
from classes import RemoteServerClass
app = Flask(__name__)

rs = RemoteServerClass.RemoteServer(host='')


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/service_list')
def service_list_handler():
    return rs.get_service_list()


@app.route('/method_list')
def method_list_handler():
    # Get service from `get_service_list` method
    return rs.get_method_list(service='')


@app.route('/get_message_template')
def get_message_template_handler():
    # Get `method` from `get_method_list` method
    return rs.get_message_template(method='')


@app.route('/get_message_schema')
def get_message_schema_handler():
    # Get `method` from `get_method_list` method
    return rs.get_message_schema(method='')


@app.route('/send_request')
def send_request_handler():
    pass


@app.route('/export')
def export_handler():
    pass


@app.route('/import')
def import_handler():
    pass


@app.route('/build_config')
def build_config_handler():
    pass
