'use strict'

const service = require('deepstream.io-service')

module.exports = function (program) {
  program
    .command('service [add|remove|start|stop]')
    .description('Add, remove, start or stop deepstream as a service to your operating system')

    .option('-c, --config [file]', 'configuration file, parent directory will be used as prefix for other config files')

    .option('--service-name <name>', 'the name to register the service')
    .option('--std-out <directory>', 'the directory for output logs')
    .option('--std-err <directory>', 'the directory for error logs')
    .option('--dry-run', 'outputs the service file to screen')
    .action(execute)
}

function response (error, result) {
  if (error) {
    console.log(error)
  } else {
    console.log(result)
  }
}

function execute(action) {
  const name = this.serviceName || 'deepstream'

  if (action === 'add') {
    const options = {
      programArgs: [],
      stdOut: this.stdOut,
      stdErr: this.stdErr,
      dryRun: this.dryRun
    }

    if (this.config) {
      options.programArgs.push(['-c'])
      options.programArgs.push([this.config])
    }

    service.add (name, options, response)
  } else if (action === 'remove') {
    service.remove (name, response)
  } else if (action === 'run' ) {
    service.run (name, response)
  }else {
    console.log(`Unknown action for service, please 'add' or 'remove'`)
  }
}
