module.exports = function (config) {
  return `
[Unit]
Description=${config.name}
After=network.target

[Service]
Type=simple
StandardOutput=${config.stdOut}
StandardError=${config.errOut}
ExecStart=${config.deepstreamExec} ${config.deepstreamArgs}
Restart=always
User=${config.user}
Group=${config.group}
Environment=

[Install]
WantedBy=multi-user.target
`
}