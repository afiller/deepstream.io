const child_process = require('child_process')
const fs = require('fs')

const systemdTemplate = require('./systemd')
const initdTemplate = require('./initd')

const ctlOptions = {
  mode: 493 // rwxr-xr-x
}

function hasSystemD () {
  return fs.existsSync('/usr/bin/systemctl') || fs.existsSync('/bin/systemctl')
}

function hasSystemV () {
  return fs.existsSync('/etc/init.d')
}

function setupSystemD (name, options, callback) {
  fs.writeFileSync(
    `/usr/lib/systemd/system/${name}.service`, 
    systemdTemplate(options), 
    ctlOptions
  )
  child_process.execSync('systemctl', ['enable', name])
  callback(null, 'SystemD service registered succesfully')
}

function setupSystemV (name, options, callback) {
  fs.writeFileSync(
   `/etc/init.d/${name}`, 
   initdTemplate(options), 
   ctlOptions
  )
  child_process.execSync('chkconfig', ['--add', name])
  child_process.execSync('update-rc.d', [name, 'defaults'])
  callback(null, 'init.d service registered succesfully')
}

module.exports.add = function (name, options, callback) {
  options.name = name
  options.pidFile = options.pidFile || `/var/run/${name}.pid`

  options.deepstreamExec = options.deepstreamExec || 'deepstream'
  options.errOut = options.errOut || 'null'
  options.stdOut = options.stdOut || 'null'

  if (options && !options.runLevels) {
  	options.runLevels = [2, 3, 4, 5].join(' ')
  } else {
    options.runLevels = options.runLevels.join(' ')
  }

  options.deepstreamArgs = options.programArgs.join(' ')

  if (hasSystemD()) {
    setupSystemD(name, options, callback)
  } else if (hasSystemV()) {
  	setupSystemV(name, options, callback)
  } else {
    callback(new Error('Only systemd and init.d services are currently supported.'))
  }
}
