# Hive Driver Examples

Here you may find some examples of using [hive-driver](https://www.npmjs.com/package/hive-driver).

For more details see: [readme](https://github.com/lenchv/hive-driver#readme).

## Running

You can simply use provided docker environment:

```bash
# run
docker-compose up -d

# stop
docker-compose down -v
```

Or you can use your own Hive, just to change the connection settings in the examples, if you need it.

## Basic usage

Here you may find how to use the library. It retrives the version of your Apache Hive instance.

[index.js](index.js)

```bash
node index.js
```

## Hive Real Life Use Cases

[petrol.js](petrol.js) and [olympic.js](olympic.js) are examples from the article [Hive Real Life Use Cases](https://acadgild.com/blog/hive-real-life-use-cases).

```bash
node petrol.js
node olympic.js
```
## Contributing

If you want to add more examples, feel free to send pull request.

## License

Under [MIT License](LICENSE)

Copyright (c) 2020 Volodymyr Liench
