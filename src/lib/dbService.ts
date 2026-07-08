import { supabase } from './supabase';
import { Product, Order, Profile } from '../types';
import { INITIAL_PRODUCTS } from '../data';

const PRODUCTS_STORAGE_KEY = 'aweni_local_products';
const ORDERS_STORAGE_KEY = 'aweni_local_orders';

// Helper to load/save from localStorage for offline/fallback mode
const getLocalProducts = (): Product[] => {
  const local = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing local products', e);
    }
  }
  // If no local products, save and return initial products
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

const getLocalOrders = (): Order[] => {
  const local = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing local orders', e);
    }
  }
  return [];
};

const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const dbService = {
  // --- Products API ---
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase fetch failed, falling back to local/static data', error.message);
        return getLocalProducts();
      }

      if (data && data.length > 0) {
        // Cache to localStorage
        saveLocalProducts(data as Product[]);
        return data as Product[];
      } else {
        // If Supabase table is empty, return local data and offer to seed
        console.info('Supabase database is empty. Using local initial products.');
        return getLocalProducts();
      }
    } catch (err) {
      console.error('Supabase query exception, using fallback:', err);
      return getLocalProducts();
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    const newId = crypto.randomUUID();
    const newProduct: Product = {
      ...product,
      id: newId,
      created_at: new Date().toISOString()
    };

    // 1. Update local cache
    const products = getLocalProducts();
    products.push(newProduct);
    saveLocalProducts(products);

    // 2. Try to write to Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();

      if (error) {
        console.warn('Supabase insert failed, stored in local cache only:', error.message);
      } else if (data && data[0]) {
        return data[0] as Product;
      }
    } catch (err) {
      console.warn('Supabase exception on insert, stored locally:', err);
    }

    return newProduct;
  },

  async updateProduct(product: Product): Promise<Product> {
    // 1. Update local cache
    const products = getLocalProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      saveLocalProducts(products);
    }

    // 2. Try to update in Supabase
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock_count: product.stock_count,
          images: product.images,
          category: product.category,
          ingredients: product.ingredients
        })
        .eq('id', product.id);

      if (error) {
        console.warn('Supabase update failed, saved locally:', error.message);
      }
    } catch (err) {
      console.warn('Supabase exception on update, saved locally:', err);
    }

    return product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    // 1. Update local cache
    const products = getLocalProducts();
    const filtered = products.filter(p => p.id !== id);
    saveLocalProducts(filtered);

    // 2. Try to delete from Supabase
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete failed, updated locally:', error.message);
      }
    } catch (err) {
      console.warn('Supabase exception on delete, updated locally:', err);
    }

    return true;
  },

  // Seed Helper to seed the database with initial products
  async seedDatabaseIfEmpty(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        console.warn('Error checking if empty for seeding:', error.message);
        return false;
      }

      if (!data || data.length === 0) {
        console.info('Seeding database with INITIAL_PRODUCTS...');
        const { error: seedError } = await supabase.from('products').insert(INITIAL_PRODUCTS);
        if (seedError) {
          console.info('Seeding skipped or deferred (database RLS active):', seedError.message);
          return false;
        }
        console.info('Database seeded successfully.');
        return true;
      }
      return false;
    } catch (err) {
      console.info('Exception during seed check:', err);
      return false;
    }
  },

  // --- Orders API ---
  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch orders failed, using local orders', error.message);
        return getLocalOrders();
      }

      if (data) {
        saveLocalOrders(data as Order[]);
        return data as Order[];
      }
    } catch (err) {
      console.error('Supabase orders query exception, using local orders:', err);
    }
    return getLocalOrders();
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const newId = crypto.randomUUID();
    const newOrder: Order = {
      ...order,
      id: newId,
      created_at: new Date().toISOString()
    };

    // 1. Save locally
    const orders = getLocalOrders();
    orders.unshift(newOrder);
    saveLocalOrders(orders);

    // 2. Try Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            id: newId,
            user_id: order.user_id,
            total_amount: order.total_amount,
            payment_method: order.payment_method,
            payment_status: order.payment_status,
            fulfillment_status: order.fulfillment_status,
            shipping_address: order.shipping_address
          }
        ])
        .select();

      if (error) {
        console.warn('Supabase order insert failed, stored locally:', error.message);
      } else if (data && data[0]) {
        return data[0] as Order;
      }
    } catch (err) {
      console.warn('Supabase exception on order insert, stored locally:', err);
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, fulfillmentStatus: Order['fulfillment_status'], paymentStatus: Order['payment_status']): Promise<boolean> {
    // 1. Update locally
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].fulfillment_status = fulfillmentStatus;
      orders[index].payment_status = paymentStatus;
      saveLocalOrders(orders);
    }

    // 2. Try Supabase
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          fulfillment_status: fulfillmentStatus,
          payment_status: paymentStatus
        })
        .eq('id', id);

      if (error) {
        console.warn('Supabase order status update failed, saved locally:', error.message);
      }
    } catch (err) {
      console.warn('Supabase exception on order status update, saved locally:', err);
    }

    return true;
  }
};
