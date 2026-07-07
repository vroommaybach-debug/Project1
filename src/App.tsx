import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/authContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { TrinityGrid } from './components/TrinityGrid';
import { HeritageScroll } from './components/HeritageScroll';
import { FAQBlock } from './components/FAQBlock';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartSlide } from './components/CartSlide';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { Showroom } from './components/Showroom';
import { ComplianceViews } from './components/ComplianceViews';
import { dbService } from './lib/dbService';
import { Product, Order, CartItem } from './types';

function MainAppContent() {
  const { user, isAdmin } = useAuth();
  
  // Navigation states
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'admin' | 'terms' | 'privacy' | 'returns'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Core synchronized data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Legal customizer state
  const [legalTexts, setLegalTexts] = useState({
    terms: [
      'By accessing our digital showrooms and purchasing our whipped organic skincare formulations, you unconditionally agree to comply with our sovereign dermal safety parameters and certified handling guidelines.',
      'All bio-active whipped Shea Soufflés, fractionated Coconut lipids, and traditionally saponified Black Soap cleansers are provided without synthetic parabens, meaning they maintain a natural shelf life of 12 to 18 months under temperature controlled storage.'
    ],
    privacy: [
      'We protect your biometric and transaction ledger coordinates with industry-standard cryptographic hashing. Your shipping physical targets are shared strictly with verified courier handlers.',
      'We do not sell or lease your raw user profile logs. Every database sync conforms directly with GDPR, CCPA, and national data safety frameworks.'
    ],
    returns: [
      'Due to the sterile, small-batch whipped bio-availability of our luxury creams, we do not accept returns on opened vessels. We offer full 100% refunds or structural exchanges if the transport vessel is fractured upon arrival.',
      'Our Lagos courier networks dispatch within 12 to 24 hours. Regional delivery transport times vary depending on range parameters selected via our real-time checkout rate sliders.'
    ]
  });

  // Fetch initial ledger data from Supabase
  const fetchData = async () => {
    try {
      // Seed database first if it has no products
      await dbService.seedDatabaseIfEmpty();
      
      const loadedProducts = await dbService.getProducts();
      const loadedOrders = await dbService.getOrders();
      setProducts(loadedProducts);
      setOrders(loadedOrders);
    } catch (err) {
      console.error('Error loading database ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync cart item counts with localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('aweni_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aweni_cart', JSON.stringify(newCart));
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_count) {
        alert('Selection capped! No more active units in organic inventory.');
        return;
      }
      const updated = cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
    // Auto slide open the cart drawer to confirm addition feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (qty > product.stock_count) {
      alert(`Limit exceeded. Only ${product.stock_count} units available.`);
      return;
    }

    const updated = cart.map(item =>
      item.product.id === productId ? { ...item, quantity: qty } : item
    );
    saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string) => {
    const filtered = cart.filter(item => item.product.id !== productId);
    saveCart(filtered);
  };

  // Checkout handling
  const handleCheckoutOpen = () => {
    setIsCartOpen(false);
    
    // Redirect to Auth if not logged in
    if (!user) {
      alert('Authentication required: To secure your shipping ledger, please log in or sign up first.');
      setIsAuthOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handlePlaceOrder = async (method: 'card_quickseller' | 'bank_transfer', address: string) => {
    const totalAmount = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    
    const newOrder = {
      user_id: user?.id || null,
      total_amount: totalAmount,
      payment_method: method,
      payment_status: method === 'card_quickseller' ? 'completed' as const : 'pending' as const,
      fulfillment_status: 'pending' as const,
      shipping_address: address
    };

    // 1. Create order
    await dbService.createOrder(newOrder);

    // 2. Reduce products stock level locally and on Supabase
    for (const item of cart) {
      const dbProd = products.find(p => p.id === item.product.id);
      if (dbProd) {
        const updated = {
          ...dbProd,
          stock_count: Math.max(0, dbProd.stock_count - item.quantity)
        };
        await dbService.updateProduct(updated);
      }
    }

    // Clear cart
    saveCart([]);
    await fetchData();
  };

  // Navigations routing dispatcher
  const handleNavigate = (view: 'home' | 'shop' | 'admin' | 'terms' | 'privacy' | 'returns') => {
    setCurrentView(view);
    setSelectedProductId(null);
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePillarClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('shop');
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Floating Header Navigation */}
      <Navigation
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={cartCount}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main Routing Views */}
      <main>
        {currentView === 'home' && (
          <div className="fade-in-transition">
            {/* 1. Hero visualizer with cascading text split and WebGL particle backdrop */}
            <Hero onExplore={() => handleNavigate('shop')} />
            
            {/* 2. Trinity Grid with 3D tilt hover state pillars */}
            <TrinityGrid onPillarClick={handlePillarClick} />
            
            {/* 3. Heritage scroll with horizontal pinning narratives */}
            <HeritageScroll />
            
            {/* 4. Interactive FAQ accordions with spring heights & float messaging chat */}
            <FAQBlock />
          </div>
        )}

        {currentView === 'shop' && (
          <Showroom
            products={products}
            selectedCategory={selectedCategory}
            onAddToCart={handleAddToCart}
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
          />
        )}

        {currentView === 'admin' && isAdmin && (
          <AdminPanel
            products={products}
            orders={orders}
            onRefreshData={fetchData}
            legalTexts={legalTexts}
            onUpdateLegal={(key, texts) => setLegalTexts(prev => ({ ...prev, [key]: texts }))}
          />
        )}

        {(currentView === 'terms' || currentView === 'privacy' || currentView === 'returns') && (
          <ComplianceViews
            view={currentView}
            onBack={() => handleNavigate('shop')}
            legalTexts={legalTexts}
          />
        )}
      </main>

      {/* Global Brand Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide Drawer - Cart Flyout */}
      <CartSlide
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutOpen}
      />

      {/* Glassmorphic Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Dual Checkout Gateway Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={subtotal}
        shippingCost={1500} // baseline, will be overridden by distance slider in cart
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
