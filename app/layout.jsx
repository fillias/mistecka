import '../styles/globals.css';
import { Footer } from '@/components/footer';

export const metadata = {
    title: {
        template: '%s | Místečka',
        default: 'Místečka'
    }
};

const themeScript = `
(function () {
  try {
    var storedTheme = localStorage.getItem('theme');
    var theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }) {
    return (
        <html lang="cs" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.png" sizes="any" />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <div className="app-shell">
                    <div className="app-container flex min-h-screen flex-col">
                        {children}
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
