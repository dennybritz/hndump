This little tool watches HackerNews (using the [API](https://github.com/HackerNews/API)) and generates a dump of new and updated stories. The data is written to stdout by default, but it's written to a daily rotating log file if you use the Docker container (see below).

Each record is an event in JSON format. There are only two types of events, `item_created` and `item_updated`. When an item is deleted a `deleted` attribute will be added to it, so it's just another update. An example record looks like this:

```json
{
  "itemId": 9890246,
  "event": "item_created",
  "timestamp": 1436947786323,
  "value": {
    "by": "danieltillett",
    "id": 9890246,
    "parent": 9889442,
    "text": "For non-crypto applications it is really good. Very fast and simple.",
    "time": 1436947704,
    "type": "comment"
  }
}
```

This data is very verbose and that's intentional. You can do with it whatever you want. You may read the events and build a relational database out of it, a time series, or a graph. Or whatever else you fancy.

The easiest way to run this is Docker:

```
docker-compose up -d
tail -f ./log/hn-events.jsonlines
```

Have fun.
