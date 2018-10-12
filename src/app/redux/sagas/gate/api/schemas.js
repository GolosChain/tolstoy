import { schema } from 'normalizr';

const notificationSchema = new schema.Entity('notifications', {}, {
    idAttribute: '_id'
});

const notificationOnlineSchema = new schema.Entity('notificationsOnline', {}, {
    idAttribute: '_id'
});

export default {
    NOTIFICATION: notificationSchema,
    NOTIFICATION_ARRAY: [notificationSchema],
    NOTIFICATION_ONLINE: notificationOnlineSchema,
    NOTIFICATION_ONLINE_ARRAY: [notificationOnlineSchema],
};
