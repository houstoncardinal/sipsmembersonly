# Sips Gettin' Real - Private Members-Only Luxury E-Commerce Platform

A multi-million-dollar quality, **PRIVATE MEMBERS-ONLY** luxury e-commerce web application with crypto-only payments (Bitcoin).

---

## 🎨 Brand & Design

**Brand Name:** Sips Gettin' Real

### Color System
- **Primary Purple:** `#6D28D9`
- **Deep Black:** `#0B0B0F`
- **Pure White:** `#FFFFFF`
- **Accent Glow:** Soft purple gradients

### Typography
- **UI:** Inter
- **Headings:** Playfair Display (elegant luxury serif)

### Design Style
- Ultra-luxury aesthetic
- Minimal but premium
- Glassmorphism effects
- Soft purple glow accents
- Smooth Framer Motion animations
- Dark theme first
- Micro-interactions everywhere

---

## ✨ Key Features

### 🔐 Security Gated Access Flow
1. **Landing Page** - Clean, basic public front
2. **Email/Password Auth** - Supabase authentication
3. **Secret Access Phrase Gate** - Per-user phrase with bcrypt/argon2 hashing
4. **Optional 2FA** - TOTP support (admin-enforceable)
5. **Dashboard Access** - Ultra-luxury members area

### 👑 Multi-Step Authentication
Beautiful animated stepper:
```
Sign In → Access Phrase → 2FA → Enter Store
```

### 🛍️ Members-Only Store
- Premium luxury dashboard
- Product grid with luxury cards
- **Quick View** on hover
- Individual product detail pages
- Shopping cart with quantity management
- **Crypto-only checkout** (Bitcoin)
- Order history with blockchain tracking
- Account & security management
- **Support ticket system**

### ₿ Crypto Payment System
**NO STRIPE - CRYPTO ONLY**

#### Checkout Flow
1. System generates unique BTC address per order
2. User sees luxury payment screen with:
   - Animated QR code with particle effects
   - Exact BTC amount in satoshis
   - Live countdown timer (30 min)
   - Copy address button
3. System monitors blockchain
4. Auto-completes after 2 confirmations

#### Order States
- `pending_payment`
- `payment_detected`
- `confirming`
- `confirmed`
- `completed`
- `expired`

### 📦 Product Features
- **12 seeded test products** across categories:
  - Private Drops (with countdown timers)
  - Collectors
  - Novelty
  - Members Exclusive
- Drop timers for limited releases
- Purchase limits per member
- Inventory tracking
- Luxury product cards with hover effects

### 👨‍💼 Admin Panel (`/admin`)
- Create/manage members
- Reset user access phrases
- Force 2FA requirements
- Manage products
- View orders
- Audit logs
- Crypto payment status monitoring

---

## 🏗️ Tech Stack

- **Vite** + React 18
- **TypeScript**
- **React Router** for navigation
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Radix UI** components
- **Supabase** (Auth + Postgres ready)
- **Crypto payment infrastructure**

---

## 🗄️ Database Schema

### crypto_payments
```sql
- id
- order_id
- user_id
- currency (BTC)
- wallet_address
- expected_amount_sats
- received_amount_sats
- confirmations
- tx_hash
- status
- expires_at
- created_at
- updated_at
```

### wallet_settings
```sql
- id
- currency
- xpub_or_api_reference
- confirmations_required
- active
```

---

## 🔒 Security Features

### Row Level Security (RLS)
- Members see only their orders/payments
- Admin sees all
- Payment updates server-side only
- Prevent client-side tampering
- Audit all payment events

### Access Phrase Security
- Per-user hashed phrases
- 5 attempts max
- 15-minute lockout after failures
- Full audit logging

---

## 🧪 Test Credentials

### Admin Account
```
Email: admin@sipsgettinreal.test
Password: Password123!
Access Phrase: inner-circle
```

### Member Account
```
Email: member@sipsgettinreal.test
Password: Password123!
Access Phrase: inner-circle
```

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
cd /Users/cardinal/Desktop/Apps/sipsmembersonly

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:5173`

---

## 🔗 Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your credentials** from Project Settings → API

3. **Update `.env`** file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Run Supabase migrations** (when implemented):
```bash
npx supabase db push
```

---

## ₿ Bitcoin Payment Integration

### Option 1: Crypto Payment Processor (Recommended)
Use a service like:
- **BTCPay Server** (self-hosted, open-source)
- **Coinbase Commerce**
- **BitPay**

### Option 2: Direct Blockchain Integration
- Use blockchain API (Blockchain.com, Blockstream, etc.)
- Generate unique addresses per order
- Poll for transactions or use webhooks

### Environment Variables
```env
BTC_PROVIDER_API_KEY=your_api_key
BTC_WEBHOOK_SECRET=your_webhook_secret
BTC_NETWORK=testnet  # or mainnet
BTC_CONFIRMATIONS_REQUIRED=2
```

---

## 🧪 Testing Crypto Payments Locally

### Mock Mode (Enabled by Default)
The checkout includes a **Mock BTC Testing Mode** toggle:

1. Add items to cart
2. Go to checkout
3. Click **"Simulate Payment (Dev Mode)"**
4. Watch the animated flow:
   - Payment detected (1.5s)
   - Confirming with 1 confirmation (3s)
   - Confirmed with 2 confirmations (5s)
   - Completed (6.5s)

### Testnet Testing
1. Switch `BTC_NETWORK` to `testnet`
2. Use a testnet wallet
3. Send test BTC to the generated address

---

## 🌐 Switching Testnet → Mainnet

1. **Update environment:**
```env
BTC_NETWORK=mainnet
BTC_CONFIRMATIONS_REQUIRED=3  # More confirmations for mainnet
```

2. **Update wallet addresses** to mainnet format

3. **Test thoroughly on testnet first**

4. **Enable production monitoring**

---

## 📱 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/auth` | Multi-step authentication | Public |
| `/dashboard` | Main store | Members only |
| `/product/:id` | Product detail page | Members only |
| `/cart` | Shopping cart | Members only |
| `/checkout` | Crypto checkout | Members only |
| `/orders` | Order history | Members only |
| `/account` | Account & support tickets | Members only |
| `/admin` | Admin panel | Admin only |

---

## 🎨 UI/UX Highlights

### Luxury Animations
- Floating particles on auth page
- Smooth page transitions
- Hover effects on all interactive elements
- Animated QR code with scanning effect
- Success celebration particles
- Pulsing glow effects
- Shimmer loading states

### Micro-interactions
- Button hover/active states
- Input focus glows
- Card lift on hover
- Progress bar animations
- Status indicator pulses
- Smooth modal transitions

---

## 📦 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx
│   ├── store/
│   │   └── ProductCard.tsx
│   └── ui/          # Radix UI components
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── data/
│   └── products.ts
├── pages/
│   ├── Index.tsx    # Landing page
│   ├── Auth.tsx     # Multi-step auth
│   ├── Dashboard.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── OrderHistory.tsx
│   ├── Account.tsx
│   └── Admin.tsx
└── index.css        # Custom luxury styles
```

---

## 🎯 Next Steps for Production

1. **Connect Supabase** for real authentication
2. **Integrate Bitcoin payment processor**
3. **Set up webhooks** for payment confirmations
4. **Add email notifications**
5. **Implement shipping logic**
6. **Add real product images**
7. **Set up monitoring & analytics**
8. **Configure CDN** for assets
9. **Enable HTTPS** and security headers
10. **Load testing**

---

## 💎 Premium Features Delivered

✅ Multi-step gated authentication with animations
✅ Luxury dark theme with purple accents
✅ Glassmorphism effects throughout
✅ Animated crypto checkout with QR code
✅ Order tracking with blockchain confirmations
✅ Support ticket system
✅ Product detail pages
✅ Shopping cart with limits
✅ Featured products carousel
✅ Drop countdown timers
✅ Admin panel
✅ Audit logging ready
✅ Mobile responsive
✅ Smooth Framer Motion animations
✅ Micro-interactions everywhere

---

**Built with ❤️ for the Inner Circle**

*Sips Gettin' Real - Where Luxury Meets Privacy*
