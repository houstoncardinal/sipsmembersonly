import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { InviteProvider } from "@/context/InviteContext";
import { MessageProvider } from "@/context/MessageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Account from "./pages/Account";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminMembers from "./pages/admin/Members";
import AdminInvites from "./pages/admin/Invites";
import AdminSecurity from "./pages/admin/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MessageProvider>
        <InviteProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/members" element={<AdminMembers />} />
                  <Route path="/admin/invites" element={<AdminInvites />} />
                  <Route path="/admin/security" element={<AdminSecurity />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </InviteProvider>
      </MessageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
