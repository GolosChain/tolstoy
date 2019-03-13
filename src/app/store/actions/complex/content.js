/* eslint-disable no-param-reassign */
import { createmssg } from 'store/actions/commun/publish';

export const createPost = ({ permlink, title, body, resources }) => {
  const data = {
    message_id: {
      permlink,
    },
    headermssg: title,
    bodymssg: body,
  };

  // prepare jsonmedata with embeds by iframely data
  if (resources) {
    const embeds = [];

    for (const resource of resources) {
      let embed = {};
      // eslint-disable-next-line default-case
      switch (resource.type) {
        case 'link':
          embed = {
            type: 'link',
            title: resource.title,
            url: resource.url,
            thumbnail_url: resource.thumbnail_url,
          };
          break;
        case 'rich':
        case 'video':
          embed = {
            type: 'embed',
            html: resource.html,
          };
          break;
        default:
      }
      embeds.push(embed);
    }

    data.jsonmetadata = JSON.stringify({
      embeds,
    });
  }

  return createmssg(data);
};

export const createComment = data => {
  data.headermssg = '';

  return createmssg(data);
};
