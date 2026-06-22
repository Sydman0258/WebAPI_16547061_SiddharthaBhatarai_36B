import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
            </div>
        </div>
    );
}