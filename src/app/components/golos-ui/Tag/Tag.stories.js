import React from 'react';
import { storiesOf } from '@storybook/react';

import Tag from './Tag';

storiesOf('Golos UI/Tag', module)
  .add('default', () => <Tag>Тег</Tag>)
  .add('category', () => <Tag category>Категория</Tag>);
