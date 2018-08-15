var remote = require('electron').remote;
require('shelljs/global');
var id_token = remote.getGlobal('token').thetoken;
console.log(id_token);