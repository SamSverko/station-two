module.exports = {
  apps: [{
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD | HH:mm:ss | Z',
    name: 'station-two-dev',
    out_file: './logs/output.log',
    script: './server.js',
    watch: true,
    ignore_watch: ['client', 'client/src', 'logs', 'node_modules']
  },
  {
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD | HH:mm:ss | Z',
    name: 'station-two',
    out_file: './logs/output.log',
    script: './server.js'
  }]
}
