module.exports = function (config) {
  return `
#!/bin/bash

### BEGIN INIT INFO
# Provides:      ${config.name}
# Required-Start:  
# Required-Stop:   
# Default-Start:   ${config.runLevels}
# Default-Stop:    0 1 6
# Short-Description: Start ${config.name} at boot time
# Description: Enable ${config.name} service.
### END INIT INFO

# chkconfig:   ${config.runLevels} 99 1
# description: ${config.name}

set_pid () {
  unset PID
  _PID=\`head -1 "${config.pidFile}" 2>/dev/null\`
  if [ $_PID ]; then
  kill -0 $_PID 2>/dev/null && PID=$_PID
  fi
}

restart () {
  stop
  start
}

start () {
  CNT=5

  set_pid

  if [ -z "$PID" ]; then
  echo starting ${config.name}

  "${config.deepstreamExec}" ${config.deepstreamArgs} >> ${config.stdOut || '/dev/null'} 2>${config.errOut || '&1'} &

  echo $! > "${config.pidFile}"

  while [ : ]; do
    set_pid

    if [ -n "$PID" ]; then
    echo started ${config.name}
    break
    else
    if [ $CNT -gt 0 ]; then
      sleep 1
      CNT=\`expr $CNT - 1\`
    else
      echo ERROR - failed to start ${config.name}
      break
    fi
    fi
  done
  else
  echo ${config.name} is already started
  fi
}

status () {
  set_pid

  if [ -z "$PID" ]; then
  exit 1
  else
  exit 0
  fi
}

stop () {
  CNT=5

  set_pid

  if [ -n "$PID" ]; then
  echo stopping ${config.name}

  kill $PID

  while [ : ]; do
    set_pid

    if [ -z "$PID" ]; then
    rm "${config.pidFile}"
    echo stopped ${config.name}
    break
    else
    if [ $CNT -gt 0 ]; then
      sleep 1
      CNT=\`expr $CNT - 1\`
    else
      echo ERROR - failed to stop ${config.name}
      break
    fi
    fi
  done
  else
  echo ${config.name} is already stopped
  fi
}

case $1 in
  restart)
  restart
  ;;
  start)
  start
  ;;
  status)
  status
  ;;
  stop)
  stop
  ;;
  *)
  echo "usage: $0 <restart|start|status|stop>"
  exit 1
  ;;
esac
`
}