# Plumber 
Like Postman^ just for GRPC
[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
[![build-with-electron](https://img.shields.io/badge/Build%20with-Electron-1f425f.svg)](https://www.electronjs.org/)
[![changelog](https://img.shields.io/badge/changelog-👈-green.svg)](https://pshktrck.ru/plumber/)
[![project news](https://img.shields.io/badge/telegram-🔔-green.svg)](https://t.me/plumberpc)



*Thanks [Milkman](https://github.com/warmuuh/milkman) and [Bloom](https://github.com/uw-labs/bloomrpc) for inpiration.*

## About
I just create a GUI for [GRPCurl](https://github.com/fullstorydev/grpcurl). This is a attempt at creating a simple tool that can speed up testing process.

## Features
...

## Build and launch 🚀
```bash
- brew install grpcurl (MacOS)
- git clone https://github.com/pashkatrick/Plumber/
- cd Plumber
- pip install virtualenv
- virtualenv venv2
- source venv2/bin/activate
- npm install
- npm run npm-install
- deactivate
- npm start
```

## Dev / Contribution 🚀
For development python backend part, you need (in this directory):
```bash
- python3 -m venv venv
- source venv/bin/activate
- pip install -r requirements.txt
- deactivate
```
Then create or set data to your .env ([example](https://github.com/pashkatrick/Plumber/blob/tcp-move/env-example), [details](https://pypi.org/project/python-decouple/#usage)), and after that:
```
- python3 app.py
```
You can use second instanse of termial, to execute first test command:
```bash
zerorpc tcp://localhost:1111 hello_world
```
