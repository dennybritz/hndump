This little tool watches HackerNews (using the [API](https://github.com/HackerNews/API))and generates a dump of new and updated stories. The data is written to daily rotating log files in the `log/`` directory (but that's configurable using the ).

Each record is an event in JSON format. There are only two types of events, `item_created` and `item_updated`. When an item is deleted a deleted attribute will be added to it, which is just another update. For example:

```json
{"level":30,"itemId":9890246,"event":"item_created","timestamp":1436947786323,"value":{"by":"danieltillett","id":9890246,"parent":9889442,"text":"For non-crypto applications it is really good. Very fast and simple.","time":1436947704,"type":"comment"},"msg":"","time":"2015-07-15T08:09:46.323Z","v":0}
```

This data is very verbose and that's intentional. You can do with it whatever you want. You may read the events and build a relational database out of it, a time series, or a graph. Or whatever else you fancy.

The easiest way to run this is Docker. Just do `docker-compose up`. Have fun.
