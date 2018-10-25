'use strict';

const nodemailer = require('nodemailer');
const Hapi = require('hapi');
const file = require('file-system');
const Handlebars = require('handlebars');
const config = require('./config.json');
const server = new Hapi.Server({
	port: 7777, 
	host: '0.0.0.0'
});

async function sendMail(from,to,subject,html){
	let data = {};
	data.from = from;
	data.to = to;
	data.subject = subject;
	data.html = html;
	transporter.sendMail(data, function (err, info) {
	   if(err)
	     console.log(err);
	});
	return data;
}


const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.email_user,
		pass: config.email_pass
	}
});

async function startInsert(){
	await server.register({
		plugin: require('inert')
	});
}

async function startVision() {
	await server.register({
		plugin: require('vision')
	});
	server.views({
        engines: {
            html: require('handlebars')
        },
        path: './views',
	    layoutPath: './views/layout',
	    partialsPath: './views/partials',
	    helpersPath: './views/helpers',
	    layout: 'default'
    });
}

const init = async () => {

	server.route([
		{
			method:'POST',
			path:'/campaign/newuser',
			handler:async (request,h) => {
				const scopes = {'scope':request.payload.scope.split(",")};
				let htmlFile = "";
				file.readFile("./views/newuser.html","utf-8",(err, data) => {
					let scope = {'scope':[]};
					scopes.scope.forEach((scp) => {
						scope.scope.push(scp.toUpperCase());
					});
					const template = Handlebars.compile(data);
					const html = template(scope);
					sendMail(
						"Webmaster <webmaster@cubscoutpack97.org>",
						request.payload.to,
						"Welcome to Pack97 admin access",
						html
					);
				});
				return "test";
			}
		}
	]);
	try{
		// await startVision();
		// await startInsert();
		await server.start();
		console.log(`${new Date()} Server running at: ${server.info.uri}/`);
	}catch (err) {  
	  console.log(err);
	}
}
init();
