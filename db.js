const cassandra = require('cassandra-driver');

module.exports = class db {
    constructor() {
        this.client = null;
    }

    init = async() => {
        let config = {
            username: 'rdcasandra',
            password:
              'EEX8Z1SymI8HHk2DpEpdSK8pw1FSnx9gDXmiVkFsFp5OsNOJqooRU9APdWBADfSbIpnp6ei3oJLs2QmkeRK4pg==',
            contactPoint: 'rdcasandra.cassandra.cosmos.azure.com',
            keySpace: "ks1",
            localDataCenter: "South Central US",
            socktOptions:{connectionTimeout:9000, readTimeout:9000}
        };
        
        let authProvider = new cassandra.auth.PlainTextAuthProvider(
            config.username,
            config.password
        );

        this.client = new cassandra.Client({
            contactPoints: [`${config.contactPoint}:10350`],
            authProvider: authProvider,
            localDataCenter: config.localDataCenter,
            sslOptions: {
                secureProtocol: "TLSv1_2_method"
            },
        });
        this.client.on('log', (level, loggerName, message, furtherInfo) => {
            console.log(`${level} - ${loggerName}:  ${message}`);
        });
        try {
            await this.client.connect();
        }
        catch(err) {
            console.log(err);
        }
    }

    get = async(id) => {
        const promise = new Promise(async(resolve, reject) => {
            try {
                var query = `SELECT * FROM ks1.t1 WHERE userid=1`;
                const resultSelect = await this.client.execute(query);
                console.log(resultSelect);
                var retval = [];
                for (const row of resultSelect.rows) {
                    console.log(
                        "Obtained row: %d | %s | %s ",
                        row.userid,
                        row.email,
                        row.name
                    );
                    retval.push({"userId": row.userId, "email": row.email, "name": row.name});
                }
                resolve(retval);
            }
            catch(exp) {
                reject(exp);
            }
        });
        return promise;
    }
}