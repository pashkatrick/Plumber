const API = require("./api-client").API
const { ipcRenderer } = require('electron');
const remote = require("electron").remote;
const dialog = remote.dialog;
const monaco = require('monaco-loader');
const fs = require('fs');
let loader = document.querySelector('#loader')
let newTab = document.querySelector('#new')
let tabs = document.querySelector('#mainTabs')
let tempItem = {}
let editorsList = []
let monaccco = null
var editorConfig = {
    language: 'json',
    value: '',
    folding: true,
    readOnly: false,
    minimap: {
        enabled: false
    },
    scrollbar: {
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        vertical: 'hidden',
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 0,
    }
}

// INIT
try {
    API.test(() => {
        monaco().then(monaco => {
            monaccco = monaco
            init_client()
        })
    })
} catch (e) {
    console.log(e)
}


ipcRenderer.on('tab-shut-down', (event, arg) => {
    closeCurrentTab()
})

ipcRenderer.on('tab-new-empty', (event, arg) => {
    addNewTab()
})

ipcRenderer.on('enter-action', (event, arg) => {
})

ipcRenderer.on('save-action', (event, arg) => {
})

newTab.addEventListener('click', () => {
    addNewTab()
})

const isOnId = (path, id) => path.some(element => element.id === id);

document.addEventListener('click', function (e) {
    e.preventDefault();
    if (isOnId(e.path, 'refresh')) {
        var _obj = getCurrentTab()
        loadMethods(_obj)
    } else if (isOnId(e.path, 'save')) {
        var _obj = getCurrentTab()
        if (_obj.saved == 'true') {
            var object = {
                item_id: _obj.tab_id.split(/[-]+/).pop(),
                name: _obj.tab_name,
                host: _obj.tab_host.value,
                method: _obj.tab_method.value,
                request_body: _obj.tab_request.getValue(),
                collection_id: document.querySelector('#accordionSidebar a.nav-link:not(.collapsed)').getAttribute('data-id')
            }
            API.update_item(JSON.stringify(object), () => {
                showSuccess(_obj)
            })
        } else {
            openModal()
        }
    } else if (isOnId(e.path, 'send')) {
        var _obj = getCurrentTab()
        API.send_request(
            _obj.tab_host.value,
            _obj.tab_method.value,
            _obj.tab_request.getValue(),
            _obj.tab_meta.value, (result) => {
                _obj.tab_response.setValue(JSON.stringify(result, undefined, 4))
                showSuccess(_obj)
            })
    } else if (isOnId(e.path, 'trash')) {
        var _obj = getCurrentTab()
        if (_obj.saved == 'true') {
            API.remove_item(_obj.tab_id.split(/[-]+/).pop(), (error, result) => {
                if (error) {
                    showError(error.message)
                } else {
                    loadColections()
                }
            })
        }
    } else if (isOnId(e.path, 'template')) {
        var _obj = getCurrentTab()
        loadTemplateMessage(_obj)
    } else if (isOnId(e.path, 'close-modal')) {
        closeModal()
    } else if (isOnId(e.path, 'edit-collection')) {
        editCollection(e.target.closest('.collection').getAttribute('data-id'))
    } else if (isOnId(e.path, 'remove-collection')) {
        removeCollection(e.target.closest('.collection').getAttribute('data-id'))
    } else if (isOnId(e.path, 'save-item')) {
        colName = document.querySelector('#collection-name').value
        colId = document.querySelector('#collections').value
        itemName = document.querySelector('#item-name').value

        if (itemName && colName) {
            addItemWithCollection(itemName, colName)
        } else if (itemName && colId) {
            addItem(itemName, colId)
        } else {
            showWarning('Complete form fields first')
        }
        closeModal()
    } else if (isOnId(e.path, 'export')) {
        var export_path = dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['openDirectory'] })
        exportCollections(export_path + '/plumber-export.json')
    } else if (isOnId(e.path, 'import')) {
        var import_file = dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openFile'],
            filters: [{ name: "All Files", extensions: ["json"] }]
        })
        importCollections(import_file)
    } else if (isOnId(e.path, 'meta')) {
        // console.log(document.querySelector(e.target.closest('#metadata')))
    }
});

function setCurrentTab(_currentTabObj) {
    currentTabObj = {}
    currentTabObj.tab_id = _currentTabObj.tab_id
    currentTabObj.saved = _currentTabObj.saved
    currentTabObj.tab_host = _currentTabObj.tab_host
    currentTabObj.tab_method = _currentTabObj.tab_method
    currentTabObj.tab_request = _currentTabObj.tab_request
    currentTabObj.tab_response = _currentTabObj.tab_response
    return currentTabObj
}

function getCurrentTab() {
    currentTabObj = {}
    var currentTab = document.querySelector('.tab-pane.fade.show.active').getAttribute('id')
    currentTabObj.tab_id = currentTab
    currentTabObj.tab_name = document.querySelector('.nav-link.active').textContent
    currentTabObj.saved = document.querySelector('.tab-pane.fade.show.active').getAttribute('saved')
    currentTabObj.tab_host = document.querySelector('#' + currentTab + ' #host')
    currentTabObj.tab_method = document.querySelector('#' + currentTab + ' #methods')
    currentTabObj.tab_meta= document.querySelector('#' + currentTab + ' #metadata')
    currentTabObj.tab_request = editorsList.find(e => e.editor_id === currentTab).editor_req
    currentTabObj.tab_response = editorsList.find(e => e.editor_id === currentTab).editor_resp
    return currentTabObj
}

function editCollection(target_id) {
    span = document.querySelector('a[data-id="' + target_id + '"] .collectionName');
    var input = document.createElement('input');
    input.value = span.textContent
    input.type = 'text'
    input.maxLength = 17
    input.classList.add('collectionName')
    span.replaceWith(input);
    input.select()

    // TODO: повесить на событие Enter - с проверкой, что есть input (отдельная функ-ция)
    input.addEventListener('blur', function () {
        updateCollection(input.value, target_id)
        var span = document.createElement('span');
        span.textContent = input.value
        span.classList.add('collectionName')
        input.replaceWith(span);
    })
}

function updateCollection(name, collection_id) {
    var object = {
        name: name,
        collection_id: collection_id
    };
    API.update_collection(JSON.stringify(object), (result) => {
    })
}

function addItemWithCollection(itemName, colName) {
    API.add_collection(colName, (result) => {
        addItem(itemName, result)
    })
}

function addItem(itemName, colId) {
    tab = getCurrentTab()
    itemObj = {
        name: itemName,
        host: tab.tab_host.value,
        method: tab.tab_method.value,
        request_body: tab.tab_request.getValue(),
        collection_id: colId
    }
    API.add_item(JSON.stringify(itemObj), () => {
        loadColections()
    })
}

function removeCollection(id) {
    API.remove_collection(id, () => {
        document.querySelector('.collection[data-id="' + id + '"]').remove()
    })
}

function getItem(_id, tabTitle) {
    addNewTab(_id, tabTitle) // ничего не ретёрнит
    var tabObj = getCurrentTab()
    API.get_item(_id, (result) => {
        tabObj.tab_host.value = result.host
        tabObj.tab_request.setValue(result.request)
        var option = document.createElement("option");
        option.value = result.method;
        option.text = result.method.split(/[.]+/).pop();
        tabObj.tab_method.innerHTML = ''
        tabObj.tab_method.appendChild(option)
    })
}

function openModal() {
    document.querySelector('#collectionModal').style.display = 'block'
}

function closeModal() {
    document.querySelector('#collectionModal').style.display = 'none'
    document.querySelector('#collection-name').innerHTML = ''
    document.querySelector('#item-name').innerHTML = ''
}

function loadMethods(tab) {
    API.method_list(tab.tab_host.value, tab.tab_meta.value, (result) => {
        var meths = result.methods
        methods = document.querySelector('#' + tab.tab_id + ' #methods')
        methods.innerHTML = ''
        showWaiting(tab)
        for (var i = 0; i < meths.length; i++) {
            var option = document.createElement("option");
            option.value = meths[i].service;
            option.text = '--' + meths[i].service.split(/[.]+/).pop() + '--';
            option.disabled = true
            methods.appendChild(option)
            for (var j = 0; j < meths[i].methods.length; j++) {
                var option = document.createElement("option");
                option.value = meths[i].methods[j];
                option.text = meths[i].methods[j].split(/[.]+/).pop();
                methods.appendChild(option)
            }
        }
    })
}

function elementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function addNewTab(tab_id = 0, tabName = 'Unsaved') {
    document.querySelector('a.nav-link.active').classList.remove('active')
    document.querySelector('.tab-pane.fade.show.active').classList.remove('show', 'active')
    if (tab_id == 0) { //если ничего не передали - возвращаем новую
        var num = getRandomInt(100)
        _generateTab(num, false, tabName)

    } else if (document.querySelector('#tab-' + tab_id)) { //если передали существующую, открываем ее
        var el = document.querySelector('a[href="#tab-' + tab_id + '"]');
        el.classList.add('active')
        document.querySelector('#tab-' + tab_id).classList.add('show', 'active');

    } else {
        _generateTab(tab_id, true, tabName)
    }
}

function _generateTab(id, saved, tabName) {
    var tab = elementFromHTML('<li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#tab-' + id + '" role="tab" aria-controls="contact" aria-selected="false">' + tabName + '</a></li>')
    tabs.insertBefore(tab, newTab.parentNode)
    var tabContent = elementFromHTML(`
        <div class="tab-pane fade show active" id="${'tab-' + id}" role="tabpanel" aria-labelledby="${'tab-' + id}" saved="${saved}">
            <nav class="navbar navbar-expand navbar-light topbar static-top bb">
                <ul class="navbar-nav mr-auto align-items-center justify-content-center">
                    <li class="nav-item mx-2">
                        <input type="text" id="host" class="form-control bg-grey" placeholder="server:82" />
                    </li>
                    <li>
                        <a href="#" id="meta"><span class="orange">META</span></a>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a href="#" class="btn bg-grey" id="refresh">
                            <span class="emoji">🔄</span>
                        </a>
                    </li>
                    <li class="nav-item mx-2">
                        <select name="select" id="methods" class="form-control bg-grey"></select>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="btn bg-grey" id="save">
                            <span class="emoji">💾</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="btn bg-grey mx-2" id="template">
                            <span class="emoji">📄</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="btn bg-grey" id="trash">
                            <span class="emoji">🗑️</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <textarea name="metadata" id="metadata" rows=""cols="30" rows="5" placeholder=""></textarea>

            <div class="container-fluid bb">
                <div class="row">
                    <div class="col-md-6 request">
                        Request
                    </div>
                    <div class="col-md-6 response">
                        Response
                    </div>
                </div>
            </div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-6 request request-field">
                        <button class="send" id="send">
                            <div class="icons">
                                <i class="fas fa-play icon-default"></i>
                                <i class="fas fa-check icon-success"></i>
                                <i class="fas fa-spinner fa-spin icon-waiting"></i>
                            </div>
                        </button>
                        <div id="request"></div>
                    </div>
                    <div class="col-md-6 response response-field">
                        <div id="response"></div>
                    </div>
                </div>
            </div>
        </div>
    `)
    document.querySelector('#myTabContent').appendChild(tabContent)
    monacoInit('tab-' + id)
    var currentTabObj = {}
    currentTabObj.tab_id = id
    currentTabObj.tab_name = tabName
    currentTabObj.saved = saved
    currentTabObj.tab_host = document.querySelector('#tab-' + id + ' #host')
    currentTabObj.tab_method = document.querySelector('#tab-' + id + ' #methods')
    currentTabObj.tab_request = document.querySelector('#tab-' + id + ' #request')
    currentTabObj.tab_response = document.querySelector('#tab-' + id + ' #response')
    setCurrentTab(currentTabObj)
}

function closeCurrentTab() {
    var active = document.querySelector('.nav-tabs a.nav-link.active')
    var activeContent = document.querySelector('.tab-pane.fade.show.active')
    if (active != document.querySelector('#tab-home')) {
        editorsList.find(ed => ed.editor_id === activeContent.getAttribute('id')).remove
        active.parentNode.remove()
        activeContent.remove()
        document.querySelector('.nav-tabs li:nth-last-child(2) a.nav-link').classList.add('active')
        document.querySelector('.tab-pane.fade:last-child').classList.add('show', 'active')
    }
}

function loadColections() {
    API.get_collections((result) => {
        showWaiting(getCurrentTab())
        var cols = result.collections
        let sidebar = document.querySelector('#accordionSidebar')
        document.querySelectorAll('#accordionSidebar .nav-item').forEach(e => e.parentNode.removeChild(e));
        modalList = document.querySelector('#collections')
        modalList.innerHTML = ''
        for (i = 0; i < cols.length; i++) {
            var items = cols[i].items

            // Модалка
            if (items.length > 0) {
                var option = document.createElement("option");
                option.value = cols[i].id
                option.text = cols[i].collection
                modalList.appendChild(option)
            }

            if (items.length > 0) {
                let child = '';
                items.forEach(item => child += '<a class="collapse-item" data-id="' + item.id + '" href="#">' + item.name + '</a>');
                var identic = 'identic_' + cols[i].id;
                sidebar.innerHTML += `
                    <li class="nav-item">
                        <div class="collection" data-id=${cols[i].id}>
                            <a class="nav-link collapsed" href="#" data-id=${cols[i].id} data-toggle="collapse" data-target="#${identic}" aria-expanded="false" aria-controls="${identic}">
                                <i class="far fa-folder"></i>
                                <span class="orange items-count"> -${items.length}- </span><span class="collectionName">${cols[i].collection}</span>
                            </a>
                            <a href="#" class="col-settings" data-settings="${identic}-set"  data-toggle="collapse" data-target="#${identic}-set" aria-expanded="true" aria-controls="${identic}-set">...</a>
                            <div class="settings-block bt collapse" id="${identic}-set">
                                <ul>
                                    <li>
                                        <a href="#" id="share-collection" disabled>📢</a>
                                    </li>
                                    <li>
                                        <a href="#" id="edit-collection">✍🏽</a>
                                    </li>
                                    <li>
                                        <a href="#" id="remove-collection">🗑️</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="${identic}" class="collapse" aria-labelledby="heading${cols[i]}" data-parent="#accordionSidebar" style="">
                            <div class="py-2 collapse-inner">
                                ${child}
                            </div>
                        </div>
                    </li>
                    `
                var options = {
                    valueNames: [ 'collectionName' ]
                };
                var filterList = new List('filter-list', options);
            }
        }
        let queryItems = document.querySelectorAll('.collapse-item')
        queryItems.forEach(function (elem) {
            elem.addEventListener('click', function () {
                tempItem.item_id = elem.getAttribute('data-id')
                tempItem.item_name = elem.textContent
                tempItem.collection_id = 'test_id'
                tempItem.collection_name = 'test_name'
                getItem(tempItem.item_id, elem.textContent)
            });
        });
    })
}

function monacoInit(_tabId) {
    var editorsObj = {}
    editorsObj.editor_id = _tabId
    editorsObj.editor_req = monaccco.editor.create(document.querySelector('#' + _tabId + ' #request'), editorConfig);
    editorsObj.editor_resp = monaccco.editor.create(document.querySelector('#' + _tabId + ' #response'), editorConfig);
    editorsList.push(editorsObj)
    return editorsObj
}

function showSuccess(tab) {
    var _default = document.querySelector('#' + tab.tab_id + ' .icon-default')
    var _hover = document.querySelector('#' + tab.tab_id + ' .icon-success')
    _hover.style.transform = 'rotate(0deg) scale(1)'
    _hover.style.opacity = '1'
    _default.style.transform = 'rotate(180deg) scale(.5)'
    _default.style.opacity = '0'
    setTimeout(() => {
        _hover.style.transform = 'rotate(-180deg) scale(.5)'
        _hover.style.opacity = '0'
        _default.style.transform = 'rotate(0deg) scale(1)'
        _default.style.opacity = '1'
    }, 1000);
}

function showWaiting(tab) {
    var _default = document.querySelector('#' + tab.tab_id + ' .icon-default')
    var _hover = document.querySelector('#' + tab.tab_id + ' .icon-waiting')
    _hover.style.transform = 'cale(1)'
    _hover.style.opacity = '1'
    _default.style.transform = 'scale(.5)'
    _default.style.opacity = '0'
    setTimeout(() => {
        _hover.style.transform = 'scale(.5)'
        _hover.style.opacity = '0'
        _default.style.transform = 'scale(1)'
        _default.style.opacity = '1'
    }, 1200);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function loadTemplateMessage(_obj) {
    API.message_template(_obj.tab_host.value, _obj.tab_method.value, _obj.tab_meta.value, (result) => {
        _obj.tab_request.setValue(JSON.stringify(result, undefined, 4));
        showSuccess(_obj)
    })
}

function showError(msg) {
    _block = document.querySelector('#error-modal')
    document.querySelector('#error-modal p').innerHTML = msg
    _block.style.opacity = '1'
    setTimeout(() => {
        _block.style.opacity = '0'
    }, 3500);
}

function showWarning(msg) {
    _block = document.querySelector('#warning-modal')
    document.querySelector('#error-modal p').innerHTML = msg
    _block.style.opacity = '1'
    setTimeout(() => {
        _block.style.opacity = '0'
    }, 3500);
}

function exportCollections(path) {
    API.export_collections((result) => {
        console.log(result)
        fs.writeFile(path, JSON.stringify(result, undefined, 4), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        _obj = getCurrentTab()
        showSuccess(_obj)
    })
}

function importCollections(path) {
    fs.readFile(path[0], (err, data) => {
        if (err) throw err;
        API.import_collections(JSON.parse(data), (result) => {
            _obj = getCurrentTab()
            showSuccess(_obj)
            console.log(result)
        })
        loadColections()
    });
}


function init_client() {
    loader.style.display = 'none';
    loadColections();
    monacoInit('tab-0')
    initObject = {}
    initObject.tab_id = 0
    initObject.saved = document.querySelector('.tab-pane.fade.show.active').getAttribute('saved')
    initObject.tab_host = document.querySelector('#tab-0 #host')
    initObject.tab_method = document.querySelector('#tab-0 #methods')
    initObject.tab_request = editorsList.find(e => e.editor_id === 'tab-0').editor_req // - да, у реквеста берем value
    initObject.tab_response = editorsList.find(e => e.editor_id === 'tab-0').editor_resp
    setCurrentTab(initObject)
}
