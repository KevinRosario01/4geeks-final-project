import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider
// _app.js or _document.js
import "@fortawesome/fontawesome-free/css/all.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RateMyProfessor Clone",
  description: "Generated by Kevin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="w-full h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
