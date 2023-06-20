import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

function Sidebar({ children }: { children: React.ReactNode }) {
  // const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar />
      <MobileFooter />
      <main className="h-full lg:pl-20">{children}</main>
    </div>
  );
}

export default Sidebar;
