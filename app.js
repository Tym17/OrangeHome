const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const { app, BrowserWindow } = require('electron');

const RealTime = require('./websockets/realtime');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const controllerRouter = require('./routes/controller');
const gameRouter = require('./routes/game');

const exp = express();

// view engine setup
exp.set('views', path.join(__dirname, 'views'));
exp.set('view engine', 'ejs');

exp.use(logger('dev'));
exp.use(express.json());
exp.use(express.urlencoded({ extended: false }));
exp.use(cookieParser());
exp.use(lessMiddleware(path.join(__dirname, 'public')));
exp.use(express.static(path.join(__dirname, 'public')));

exp.use('/', indexRouter);
exp.use('/users', usersRouter);
exp.use('/controller', controllerRouter);
exp.use('/game', gameRouter);

// catch 404 and forward to error handler
exp.use((req, res, next) => {
  next(createError(404));
});

// error handler
exp.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = exp;

let socks = new RealTime();

socks.start();

if (require('./package.json').config.nogui === false) {

  // Modules to control application life and create native browser window

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow;

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000/game');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

}