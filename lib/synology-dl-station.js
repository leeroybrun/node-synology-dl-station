/*
    ------------------------------------------------------------------
    Synology Download Station API module for Node.js
    ------------------------------------------------------------------

    Author :        Leeroy Brun (leeroy.brun@gmail.com)
    Github repo :   https://github.com/leeroybrun/node-allocine-api
    Version :       0.1.0
    Release date :  23.05.2013
*/

var request = require('request');

var Synology = function(host, username, password) {
	var self = this;

	this.cookiesJar = request.jar();

	this.config.host = host;
	this.config.username = username;
	this.config.password = password;

	this.login(function(error) {
		if(!error) {
			console.log('Success !');
		} else {
			console.log('Login error');
		}
	});
}

Synology.prototype.config = {
	host: '',
	username: '',
	password: ''
}

Synology.prototype.endPoints = {
	auth: {
		path: '/webapi/query.cgi',
		params: {
			api: 'SYNO.API.Info',
			version: 1,
			method: 'query',
			query: 'SYNO.DownloadStation.Task'
		}
	},
	task: {
		path: 'DownloadStation/task.cgi',
		params: {

		}
	}
};

// Extend an object with other objects
Synology.prototype.extend = function (dst) {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== dst) {
            for(var key in arguments[i]) {
                dst[key] = arguments[i][key];
            };
        }
    };

    return dst;
}

Synology.prototype.buildUrl = function(endPoint, params) {
	if(typeof params == 'undefined') { var params = {}; }

	params = this.extend({}, endPoint.params, params);

	var queryStr = '';
	for(var key in params) {
		queryStr += key +'='+ encodeURIComponent(params[key]) +'&';
	}
	queryStr = queryStr.slice(0,-1);

	return 'https://'+ this.config.host + endPoint.path +'?'+ queryStr;
}

Synology.prototype.login = function(callback) {
	var url = this.buildUrl(this.endPoints.auth);

	request({url: url, jar: this.cookiesJar}, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var data = JSON.parse(body).data;

			callback(false);
		} else {
			callback(true);
		}
	});
}

module.exports = Synology;