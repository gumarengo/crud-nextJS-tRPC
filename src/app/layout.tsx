import './globals.css';
import { Providers } from './Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className="bg-gray-50 text-gray-900 font-sans p-8">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}