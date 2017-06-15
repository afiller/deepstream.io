'use strict'

const service = require('os-service')

module.exports = function (program) {
  program
		.command('service [add|remove]')
		.description('Add or remove deepstream as a service to your operating system')
		.action(addService)
}

function addService(action) {
  if (action === 'add') {
    const options = {
        displayName: "MyService",
        programArgs: ["--server-port", 8888],
        username: ".\Stephen Vickers",
        password: "MyPassword :)"
    }

    service.add ("my-service", options, function(error) {
        console.log('done')
        if (error)
            console.trace(error);
    })
  } else if (action === 'remove') {
    service.remove ("my-service", options, function(error) {
        if (error)
            console.trace(error);
    })
  } else {
    console.error(`Unknown action for service, please 'add' or 'remove'`)
  }
}
