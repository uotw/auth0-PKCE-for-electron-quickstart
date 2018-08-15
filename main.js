'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _AuthService = require('./js/AuthService');

var _AuthService2 = _interopRequireDefault(_AuthService);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var ElectronOnline = require('electron-online')
var connection = new ElectronOnline();
var offlineWindow = void 0;
var authWindow = void 0;
var mainWindow = void 0;

connection.on('online', () => {
    if (authWindow) {
        authWindow.focus();
    } else if (mainWindow) {
        mainWindow.focus();
    } else {
        createauthWindow();
    }
    if (offlineWindow) {
        offlineWindow.close();
    }
})

connection.on('offline', () => {
    offlineWindow = new BrowserWindow({
        width: 520,
        height: 250
    });
    offlineWindow.setResizable(false);
    offlineWindow.loadURL('file://' + __dirname + '/offline.html');
    if (authWindow) {
        console.log("yes to close");
    }
})



function getAuthConfig() {
    var authConfig = {
        clientId: 'XB0zarh086Hr8vx6m3G3sQZz2SAaOjrQ', //new
        authorizeEndpoint: 'https://ultrasoundjelly.auth0.com/authorize',
        audience: 'https://ultrasoundjelly.auth0.com/userinfo',
        scope: 'openid',
        redirectUri: 'https://ultrasoundjelly.auth0.com/mobile',
        tokenEndpoint: 'https://ultrasoundjelly.auth0.com/oauth/token'
    };
    return authConfig;
}

var mainWindow = void 0;

function createmainWindow(token) { //, authWindow) {
    // Create the browser window.
    authWindow.close();
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800
    });
    mainWindow.setResizable(false);

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    var responsetoken = JSON.parse(token);
    global.token = {
        thetoken: token //responsetoken.id_token
    };
    mainWindow.on('close', function(event) {

    });
    mainWindow.on('focus', () => {
        if (connection.status == "OFFLINE") {
            offlineWindow.focus();
        }
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

function createauthWindow() {

    var authService = new _AuthService2.default(getAuthConfig());
    authWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        //show: false
    });
    authWindow.showInactive();
    authWindow.setResizable(false);

    authWindow.on('closed', () => {
        authWindow = null;
    });
    authWindow.on('focus', () => {
        if (connection.status == "OFFLINE") {
            offlineWindow.focus();
        }
    });

    authWindow.loadURL(authService.requestAuthCode());

    authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
        authService.requestAccessCode(newUrl, createmainWindow, authWindow); //, authWindow);
    });
    authWindow.webContents.on('will-navigate', function() {

    });
}

app.on("ready", function() {

});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (!mainWindow && !authWindow) {
        createauthWindow();
    }
});