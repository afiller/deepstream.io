module.exports = function (config) {
  return `
[Unit]
Description=${config.name}
After=network.target

[Service]
Type=simple
StandardOutput=${config.stdOut}
StandardError=${config.errOut}
UMask=0007
ExecStart=${config.deepstreamExec} ${config.deepstreamArgs}

[Install]
`
}