import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
    <Toaster
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-gray-800 text-[#fffff] border border-red shadow-xl",
        }
      }}
    />
  </SocketProvider>,
);
