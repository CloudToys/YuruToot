import logo_full from '@/images/logo-symbol-wordmark.png';
import logo from '@/images/logo.png';

export const WordmarkLogo: React.FC = () => (
  <img src={logo_full} alt='Mastodon Glitch Edition' className='logo logo--wordmark' />
);

export const SymbolLogo: React.FC = () => (
  <img src={logo} alt='Mastodon Glitch Edition' className='logo logo--icon' />
);
