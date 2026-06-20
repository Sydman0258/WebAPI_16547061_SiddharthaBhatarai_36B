
import { AuthProvider } from "@/lib/context/authContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
       {children}
       <ToastContainer/>
       </AuthProvider>
     </body>
    </html>
  );
}
