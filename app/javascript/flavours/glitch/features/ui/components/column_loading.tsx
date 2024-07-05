import Column from 'flavours/glitch/components/column';
import type {Props as ColumnHeaderProps} from 'flavours/glitch/components/column_header';
import {ColumnHeader} from 'flavours/glitch/components/column_header';

export const ColumnLoading: React.FC<ColumnHeaderProps> = (otherProps) => (
  <Column>
    <ColumnHeader {...otherProps} />
    <div className='scrollable' />
  </Column>
);
