
import { AuthProvider } from "@/lib/context/authContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/lib/context/CartContext";
import { ThemeProvider } from "next-themes";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html   lang="en" suppressHydrationWarning >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
            storageKey="grubgo-theme"
            themes={["light", "dark"]}
          >
          <CartProvider>
       {children}
       </CartProvider>
       </ThemeProvider>
       <ToastContainer/>
       </AuthProvider>
     </body>
    </html>
  );
}
