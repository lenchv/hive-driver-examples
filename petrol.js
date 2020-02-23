/**
 * Hive Real Life Use Cases
 * https://acadgild.com/blog/hive-real-life-use-cases
 * (c) prateek
 */
const hive = require('hive-driver');
const {
    TCLIService, TCLIService_types
} = hive.thrift;

const client = new hive.HiveClient(
    TCLIService, TCLIService_types
);
const utils = new hive.HiveUtils(TCLIService_types);
const logger = (logResponse) => console.log(logResponse.taskStatus);

client.connect({
    host: 'localhost',
    port: 10000
}).then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });

    await execute(
        session,
        `create table if not exists petrol (
            distributer_id STRING,
            distributer_name STRING,
            amt_IN STRING,
            amy_OUT STRING,
            vol_IN INT,
            vol_OUT INT,
            year INT
        ) row format delimited fields terminated by ',' stored as textfile`
    );

    execute(
        session,
        'load data local inpath \'/opt/assets/petrol.txt\' into table petrol'
    );

    // 1) In real life what is the total amount of petrol in volume sold by every distributor?
    const totalAmountOfPetrol = await execute(session, 'SELECT distributer_name,SUM(vol_OUT) FROM petrol GROUP BY distributer_name');
    console.log('totalAmountOfPetrol', totalAmountOfPetrol);

    // 2) Which are the top 10 distributors ID’s for selling petrol and also display the amount of petrol sold in volume by them individually?
    const topTenDistributors = await execute(session, 'SELECT distributer_id,vol_OUT FROM petrol order by vol_OUT desc limit 10');
    console.log('topTenDistributors', topTenDistributors);

    // 3) Find real life 10 distributor name who sold petrol in the least amount.
    const soldPetrolTheLeast = await execute(session, 'SELECT distributer_id,vol_OUT FROM petrol order by vol_OUT limit 10')
    console.log('soldPetrolTheLeast', soldPetrolTheLeast);

    await execute(session, 'DROP TABLE petrol');

    await session.close();
    await client.close();
}).catch(error => {
    console.error(error);
});

async function execute(session, statement) {
    const operation = await session.executeStatement(statement, { runAsync: true });
    await utils.waitUntilReady(operation, true, logger);
    await utils.fetchAll(operation);
    const result = await utils.getResult(operation);

    await operation.close();

    return result.getValue();
}
