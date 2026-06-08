
import { AuthProvider } from "@/lib/context/authContext";
import "./globals.css";



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
       </AuthProvider>
     </body>
    </html>
  );
}
