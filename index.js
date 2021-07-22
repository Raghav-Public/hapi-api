'use strict';

const Hapi = require('@hapi/hapi');
const db = require('./db');
const dbcon = new db();

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async(request, h) => {
            let rows = await dbcon.get(1).catch((err) => {
                console.log(err);
                return err;
            });
            return rows;
        }
    });
    
    await dbcon.init();
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();