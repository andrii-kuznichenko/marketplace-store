import UserIcon from '../UserIcon';
import MobileSidebarClient from './MobileSidebarClient';

async function MobileSidebar() {
  return <MobileSidebarClient userIcon={<UserIcon />} />;
}

export default MobileSidebar;
