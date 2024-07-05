import Column from 'mastodon/components/column';
import type {Props as ColumnHeaderProps} from 'mastodon/components/column_header';
import {ColumnHeader} from 'mastodon/components/column_header';

export const ColumnLoading: React.FC<ColumnHeaderProps> = (otherProps) => (
  <Column>
    <ColumnHeader {...otherProps} />
    <div className='scrollable' />
  </Column>
);
