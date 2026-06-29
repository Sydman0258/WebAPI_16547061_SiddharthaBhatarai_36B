
import { AuthProvider } from "@/lib/context/authContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/lib/context/CartContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
       {children}
       </CartProvider>
       <ToastContainer/>
       </AuthProvider>
     </body>
    </html>
  );
}
