export default function Loading() {
    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
            {/* Fake Navbar Skeleton */}
            

            {/* Main Spinner Center Stage */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="relative flex items-center justify-center">
                    {/* Outer pulsing ring */}
                    <div className="absolute w-16 h-16 rounded-full border-4 border-orange-100 animate-ping opacity-75" />
                    
                    {/* Inner spinning gradient */}
                    <div className="w-14 h-14 rounded-full border-4 border-t-red-600 border-r-orange-500 border-b-gray-100 border-l-gray-100 animate-spin" />
                </div>
                
                <h2 className="mt-6 text-lg font-bold tracking-tight text-gray-800 animate-pulse">
                    Preparing your experience...
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                    Just a moment while we set things up.
                </p>
            </main>

            {/* Bottom Footer Spacing alignment */}
            <div className="h-16 w-full opacity-0" />
        </div>
    );
}