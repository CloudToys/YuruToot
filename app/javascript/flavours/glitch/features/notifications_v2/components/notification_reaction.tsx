import {FormattedMessage} from 'react-intl';

import MoodIcon from '@/material-icons/400-24px/mood.svg?react';
import type {NotificationGroupReaction} from 'flavours/glitch/models/notification_group';

import type {LabelRenderer} from './notification_group_with_status';
import {NotificationGroupWithStatus} from './notification_group_with_status';

const labelRenderer: LabelRenderer = (values) => (
  <FormattedMessage
    id='notification.reaction'
    defaultMessage='{name} reacted to your status'
    values={values}
  />
);

export const NotificationReaction: React.FC<{
  notification: NotificationGroupReaction;
  unread: boolean;
}> = ({ notification, unread }) => {
  return (
    <NotificationGroupWithStatus
      type='reaction'
      icon={MoodIcon}
      iconId='react'
      accountIds={notification.sampleAccountIds}
      statusId={notification.statusId}
      timestamp={notification.latest_page_notification_at}
      count={notification.notifications_count}
      labelRenderer={labelRenderer}
      unread={unread}
    />
  );
};
