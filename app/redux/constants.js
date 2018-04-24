const CategoryTypes = {
  FEED: 'feed',
  FEED_ONLY_POST: 'feed_only_posts',
  FEED_ONLY_REPOST: 'feed_only_reposts',
};

export default {
    FETCH_DATA_BATCH_SIZE: 20,
    FETCH_DATA_EXPIRE_SEC: 15, //30,
    FETCH_DATA_TRUNCATE_BODY: 1024,
    DEFAULT_SORT_ORDER: 'trending',
    CATEGORIES: CategoryTypes,
    JULY_14_HACK: new Date('2016-07-14T00:00:00Z').getTime(),
};
