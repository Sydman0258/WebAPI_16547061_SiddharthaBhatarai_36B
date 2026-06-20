import React from 'react';

export default function Unauthorised() {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 font-sans text-gray-800">
            <div className="w-full max-w-md bg-white p-8 text-center rounded-2xl shadow-md border border-gray-100">
                <h1 className="text-7xl font-extrabold text-red-500 mb-2 tracking-tight">401</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                    Oops! You don't have permission to access this page. Please make sure you are logged in with the correct account.
                </p>
                <button
                    onClick={handleGoBack}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}