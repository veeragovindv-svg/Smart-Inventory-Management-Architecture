import './globals.css';

export const metadata = {
  title: 'SmartStore AI - Supermarket Inventory & Forecasting',
  description: 'Supermarket Inventory Tracking with AI Demand Forecasting and Automated Supplier Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
