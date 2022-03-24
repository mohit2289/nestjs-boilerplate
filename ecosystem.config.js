/**
 * @author Siddhant Bahuguna
 * 
 * @description this file points out the nodejs server settings.
 * The settings currently are for running the server in cluster mode along 
 * with error and log files defined in a specific folder
 */

module.exports = {
  apps : [{
    name   : 'backend-admin-supplier-aggregator',
    script : './dist/main.js',
    error_file : '/var/logs/containers/err.log',
    out_file : '/var/logs/containers/out.log',
    instances : 'max',
    exec_mode : 'cluster',
    env: {
      NODE_ENV: "development",
    },
  }]
};
