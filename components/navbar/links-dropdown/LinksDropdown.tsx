import UserIcon from '../UserIcon';
import LinksSignIn from './LinksSignIn';
import LinksDropdownClient from './LinksDropdownClient';

function LinksDropdown() {
  return (
    <LinksDropdownClient
      userIcon={<UserIcon />}
      signedInLinks={<LinksSignIn />}
    />
  );
}

export default LinksDropdown;
