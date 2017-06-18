'use strict'

const service = require('../src/service/service')

module.exports = function (program) {
  program
		.command('service [add|remove]')
		.description('Add or remove deepstream as a service to your operating system')
		.action(execute)
}

function execute(action) {
  const name = 'deepstream'

  if (action === 'add') {
    const options = {
      programArgs: []
    }

    service.add (name, options, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        console.log(result)
      }
    })
  } else if (action === 'remove') {
    service.remove (name, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        console.log(result)
      }
    })
  } else {
    console.log(`Unknown action for service, please 'add' or 'remove'`)
  }
}
