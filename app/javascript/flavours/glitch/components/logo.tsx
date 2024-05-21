import logo from '@/images/logo.svg';

export const WordmarkLogo: React.FC = () => (
  <img src='https://squares.puyopuyotetr.is/logo.png' className='logo logo--wordmark' alt='Mastodon' />
);

export const SymbolLogo: React.FC = () => (
  <img src={logo} alt='Mastodon' className='logo logo--icon' />
);
