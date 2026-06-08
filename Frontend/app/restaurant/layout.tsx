import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - Fixed Left */}
      <Sidebar />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed Top */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}