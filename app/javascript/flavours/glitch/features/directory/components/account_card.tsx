import type {MouseEventHandler} from 'react';
import {useCallback} from 'react';

import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import classNames from 'classnames';

import {followAccount, unblockAccount, unfollowAccount, unmuteAccount,} from 'flavours/glitch/actions/accounts';
import {openModal} from 'flavours/glitch/actions/modal';
import {Avatar} from 'flavours/glitch/components/avatar';
import {Button} from 'flavours/glitch/components/button';
import {DisplayName} from 'flavours/glitch/components/display_name';
import {Permalink} from 'flavours/glitch/components/permalink';
import {ShortNumber} from 'flavours/glitch/components/short_number';
import {autoPlayGif, me} from 'flavours/glitch/initial_state';
import type {Account} from 'flavours/glitch/models/account';
import {makeGetAccount} from 'flavours/glitch/selectors';
import {useAppDispatch, useAppSelector} from 'flavours/glitch/store';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  cancel_follow_request: {
    id: 'account.cancel_follow_request',
    defaultMessage: 'Withdraw follow request',
  },
  cancelFollowRequestConfirm: {
    id: 'confirmations.cancel_follow_request.confirm',
    defaultMessage: 'Withdraw request',
  },
  requested: {
    id: 'account.requested',
    defaultMessage: 'Awaiting approval. Click to cancel follow request',
  },
  unblock: { id: 'account.unblock_short', defaultMessage: 'Unblock' },
  unmute: { id: 'account.unmute_short', defaultMessage: 'Unmute' },
  unfollowConfirm: {
    id: 'confirmations.unfollow.confirm',
    defaultMessage: 'Unfollow',
  },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
});

const getAccount = makeGetAccount();

export const AccountCard: React.FC<{ accountId: string }> = ({ accountId }) => {
  const intl = useIntl();
  const account = useAppSelector((s) => getAccount(s, accountId));
  const dispatch = useAppDispatch();

  const handleMouseEnter = useCallback<MouseEventHandler>(
    ({ currentTarget }) => {
      if (autoPlayGif) {
        return;
      }
      const emojis =
        currentTarget.querySelectorAll<HTMLImageElement>('.custom-emoji');

      emojis.forEach((emoji) => {
        const original = emoji.getAttribute('data-original');
        if (original) emoji.src = original;
      });
    },
    [],
  );

  const handleMouseLeave = useCallback<MouseEventHandler>(
    ({ currentTarget }) => {
      if (autoPlayGif) {
        return;
      }

      const emojis =
        currentTarget.querySelectorAll<HTMLImageElement>('.custom-emoji');

      emojis.forEach((emoji) => {
        const staticUrl = emoji.getAttribute('data-static');
        if (staticUrl) emoji.src = staticUrl;
      });
    },
    [],
  );

  const handleFollow = useCallback(() => {
    if (!account) return;

    if (account.getIn(['relationship', 'following'])) {
      dispatch(
        openModal({
          modalType: 'CONFIRM',
          modalProps: {
            message: (
              <FormattedMessage
                id='confirmations.unfollow.message'
                defaultMessage='Are you sure you want to unfollow {name}?'
                values={{ name: <strong>@{account.get('acct')}</strong> }}
              />
            ),
            confirm: intl.formatMessage(messages.unfollowConfirm),
            onConfirm: () => {
              dispatch(unfollowAccount(account.get('id')));
            },
          },
        }),
      );
    } else if (account.getIn(['relationship', 'requested'])) {
      dispatch(
        openModal({
          modalType: 'CONFIRM',
          modalProps: {
            message: (
              <FormattedMessage
                id='confirmations.cancel_follow_request.message'
                defaultMessage='Are you sure you want to withdraw your request to follow {name}?'
                values={{ name: <strong>@{account.get('acct')}</strong> }}
              />
            ),
            confirm: intl.formatMessage(messages.cancelFollowRequestConfirm),
            onConfirm: () => {
              dispatch(unfollowAccount(account.get('id')));
            },
          },
        }),
      );
    } else {
      dispatch(followAccount(account.get('id')));
    }
  }, [account, dispatch, intl]);

  const handleBlock = useCallback(() => {
    if (account?.relationship?.blocking) {
      dispatch(unblockAccount(account.get('id')));
    }
  }, [account, dispatch]);

  const handleMute = useCallback(() => {
    if (account?.relationship?.muting) {
      dispatch(unmuteAccount(account.get('id')));
    }
  }, [account, dispatch]);

  const handleEditProfile = useCallback(() => {
    window.open('/settings/profile', '_blank');
  }, []);

  if (!account) return null;

  let actionBtn;

  if (me !== account.get('id')) {
    if (!account.get('relationship')) {
      // Wait until the relationship is loaded
      actionBtn = '';
    } else if (account.getIn(['relationship', 'requested'])) {
      actionBtn = (
        <Button
          text={intl.formatMessage(messages.cancel_follow_request)}
          title={intl.formatMessage(messages.requested)}
          onClick={handleFollow}
        />
      );
    } else if (account.getIn(['relationship', 'muting'])) {
      actionBtn = (
        <Button
          text={intl.formatMessage(messages.unmute)}
          onClick={handleMute}
        />
      );
    } else if (!account.getIn(['relationship', 'blocking'])) {
      actionBtn = (
        <Button
          disabled={account.relationship?.blocked_by}
          className={classNames({
            'button--destructive': account.getIn(['relationship', 'following']),
          })}
          text={intl.formatMessage(
            account.getIn(['relationship', 'following'])
              ? messages.unfollow
              : messages.follow,
          )}
          onClick={handleFollow}
        />
      );
    } else if (account.getIn(['relationship', 'blocking'])) {
      actionBtn = (
        <Button
          text={intl.formatMessage(messages.unblock)}
          onClick={handleBlock}
        />
      );
    }
  } else {
    actionBtn = (
      <Button
        text={intl.formatMessage(messages.edit_profile)}
        onClick={handleEditProfile}
      />
    );
  }

  return (
    <div className='account-card'>
      <Permalink
        href={account.get('url')}
        to={`/@${account.get('acct')}`}
        className='account-card__permalink'
      >
        <div className='account-card__header'>
          <img
            src={
              autoPlayGif ? account.get('header') : account.get('header_static')
            }
            alt=''
          />
        </div>

        <div className='account-card__title'>
          <div className='account-card__title__avatar'>
            <Avatar account={account as Account} size={56} />
          </div>
          <DisplayName account={account as Account} />
        </div>
      </Permalink>

      {account.get('note').length > 0 && (
        <div
          className='account-card__bio translate'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          dangerouslySetInnerHTML={{ __html: account.get('note_emojified') }}
        />
      )}

      <div className='account-card__actions'>
        <div className='account-card__counters'>
          <div className='account-card__counters__item'>
            <ShortNumber value={account.get('statuses_count')} />
            <small>
              <FormattedMessage id='account.posts' defaultMessage='Posts' />
            </small>
          </div>

          <div className='account-card__counters__item'>
            <ShortNumber value={account.get('followers_count')} />{' '}
            <small>
              <FormattedMessage
                id='account.followers'
                defaultMessage='Followers'
              />
            </small>
          </div>

          <div className='account-card__counters__item'>
            <ShortNumber value={account.get('following_count')} />{' '}
            <small>
              <FormattedMessage
                id='account.following'
                defaultMessage='Following'
              />
            </small>
          </div>
        </div>

        <div className='account-card__actions__button'>{actionBtn}</div>
      </div>
    </div>
  );
};
