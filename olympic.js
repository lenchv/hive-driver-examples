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
        `create table if not exists olympic (
            athelete STRING,
            age INT,
            country STRING,
            year STRING,
            closing STRING,
            sport STRING,
            gold INT,
            silver INT,
            bronze INT,
            total INT
        ) row format delimited fields terminated by '\t' stored as textfile`
    );

    await execute(
        session,
        'load data local inpath \'/opt/assets/olympic_data.csv\' into table olympic'
    );

    // 1) Using the dataset list the total number of medals won by each country in swimming.
    console.log(
        await execute(session, 'select country,SUM(total) from olympic where sport = "Swimming" GROUP BY country')
    );

    // 2) Display real life number of medals India won year wise.
    console.log(
        await execute(session, 'select year,SUM(total) from olympic where country = "India" GROUP BY year')
    );

    // 3) Find the total number of medals each country won display the name along with total medals.
    console.log(
        await execute(session, 'select country,SUM(total) from olympic GROUP BY country')
    );

    // 4) Find the real life number of gold medals each country won.
    console.log(
        await execute(session, 'select country,SUM(gold) from olympic GROUP BY country')
    );

    await execute(session, 'DROP TABLE olympic');

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
