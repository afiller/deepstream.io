'use strict'

const service = require('../src/service/service')

module.exports = function (program) {
  program
		.command('service [add|remove]')
		.description('Add or remove deepstream as a service to your operating system')
		.action(addService)
}

function addService(action) {
  const name = 'deepstream'

  if (action === 'add') {
    const options = {
      programArgs: ["--server-port", 8888]
    }

    service.add (name, options, function(error, result) {
      
    })
  } else if (action === 'remove') {
    service.remove (name, function(error, result) {
        if (error)
            console.trace(error);
    })
  } else {
    console.error(`Unknown action for service, please 'add' or 'remove'`)
  }
}
