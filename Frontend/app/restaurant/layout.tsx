import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
    return (
        // 1. h-screen locks the main frame viewport height so it doesn't grow infinitely
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            
            {/* 2. Wrap Sidebar in a sticky layout boundary container */}
            <aside className="sticky top-0 h-screen shrink-0 hidden md:block border-r border-gray-100 bg-white">
                <Sidebar />
            </aside>

            {/* 3. Make this side area scroll independently */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header />
                <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}