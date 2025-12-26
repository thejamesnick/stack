# UI/Database Schema Alignment Check

## ✅ PERFECT MATCHES

### 1. **SavingsStack Interface → stacks Table**

| Frontend (types/index.ts) | Database (stacks table) | Status |
|---------------------------|-------------------------|--------|
| `id: string` | `id UUID` | ✅ Match |
| `name: string` | `name TEXT` | ✅ Match |
| `targetAmount: number` | `target_amount NUMERIC(20,2)` | ✅ Match |
| `currentAmount: number` | `current_amount NUMERIC(20,2)` | ✅ Match |
| `frequency: Frequency` | `frequency TEXT` | ✅ Match |
| `amountPerPull: number` | `amount_per_pull NUMERIC(20,2)` | ✅ Match |
| `startDate: string` | `start_date TIMESTAMP` | ✅ Match |
| `endDate: string` | `end_date TIMESTAMP` | ✅ Match |
| `status: StackStatus` | `status TEXT` | ✅ Match |
| `asset: string` | `asset_symbol TEXT` | ✅ Match |
| `emoji: string` | `emoji TEXT` | ✅ Match |

**Additional Database Fields (Not in UI yet):**
- `fid` - Will be added when we integrate auth
- `wallet_address` - Will be populated from connected wallet
- `asset_address` - Token contract address (for smart contract)
- `contract_stack_id` - Links to blockchain (Phase 1)
- `tx_hash` - Creation transaction (Phase 1)
- `created_at`, `updated_at` - Metadata

### 2. **Frequency Enum**

| Frontend | Database | Match |
|----------|----------|-------|
| `DAILY = 'Daily'` | `'daily'` | ⚠️ Case mismatch |
| `WEEKLY = 'Weekly'` | `'weekly'` | ⚠️ Case mismatch |
| `MONTHLY = 'Monthly'` | `'monthly'` | ⚠️ Case mismatch |

**Action Required:** Standardize to lowercase in frontend.

### 3. **StackStatus Enum**

| Frontend | Database | Match |
|----------|----------|-------|
| `ACTIVE = 'Active'` | `'active'` | ⚠️ Case mismatch |
| `COMPLETED = 'Completed'` | `'completed'` | ⚠️ Case mismatch |
| `BROKEN = 'Broken'` | `'broken'` | ⚠️ Case mismatch |

**Action Required:** Standardize to lowercase in frontend.

### 4. **UserWallet Interface → users + wallets Tables**

| Frontend (types/index.ts) | Database | Status |
|---------------------------|----------|--------|
| `address: string` | `wallets.address TEXT` | ✅ Match |
| `balance: number` | ❌ Not stored (fetched from blockchain) | ⚠️ By design |
| `isConnected: boolean` | ❌ Not stored (session state) | ⚠️ By design |

**Note:** Balance is fetched real-time from blockchain, not stored in DB.

## 🔧 REQUIRED UPDATES

### Update 1: Fix Enum Case Sensitivity

**File:** `miniapp/src/types/index.ts`

```typescript
// BEFORE
export enum Frequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export enum StackStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  BROKEN = 'Broken',
}

// AFTER (to match database)
export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum StackStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  BROKEN = 'broken',
}
```

### Update 2: Add Missing Fields to SavingsStack Interface

**File:** `miniapp/src/types/index.ts`

```typescript
export interface SavingsStack {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  frequency: Frequency;
  amountPerPull: number;
  startDate: string;
  endDate: string;
  status: StackStatus;
  asset: string;
  emoji: string;
  
  // NEW: Add these for database integration
  fid?: number; // Farcaster ID (optional for now, required later)
  walletAddress?: string; // Wallet that created this stack
  contractStackId?: number; // Blockchain link
  txHash?: string; // Creation transaction
}
```

## ✅ UI COMPONENTS THAT WORK WITH SCHEMA

### Components Using SavingsStack:
1. ✅ `StackCard.tsx` - Displays stack info
2. ✅ `StackDetailsModal.tsx` - Shows full stack details
3. ✅ `ShareSuccessModal.tsx` - Shares stack milestones
4. ✅ `BreakStackModal.tsx` - Breaks stack early
5. ✅ `Home.tsx` - Lists active stacks
6. ✅ `History.tsx` - Shows completed/broken stacks
7. ✅ `App.tsx` - Main state management

**All components will work seamlessly once we:**
1. Fix enum casing
2. Add optional fields to interface
3. Connect to Supabase

## 🎯 MISSING UI COMPONENTS (Needed for Full DB Integration)

### 1. **Leaderboard Component** (Not built yet)
Database ready: ✅ `leaderboards` table exists
UI needed: ❌ Need to build `Leaderboard.tsx`

### 2. **Achievements/Badges Component** (Not built yet)
Database ready: ✅ `achievements` + `user_achievements` tables exist
UI needed: ❌ Need to build `Achievements.tsx`

### 3. **Notifications Component** (Not built yet)
Database ready: ✅ `notifications` table exists
UI needed: ❌ Need to build `Notifications.tsx`

### 4. **Profile Settings** (Partially built)
Database ready: ✅ `users.notification_preferences` exists
UI: ⚠️ `ProfileModal.tsx` exists but doesn't use preferences yet

## 📊 DATA FLOW VERIFICATION

### Current Flow (Mock Data):
```
App.tsx → MOCK_STACKS → Components
```

### Future Flow (Real Data):
```
App.tsx → Supabase Query → stacks table → Components
```

**Example Query:**
```typescript
const { data: stacks } = await supabase
  .from('stacks')
  .select('*')
  .eq('fid', userFid)
  .order('created_at', { ascending: false });
```

## ✅ CROSS-PLATFORM READINESS

| Feature | Database | UI | Status |
|---------|----------|-----|--------|
| Multi-platform auth | ✅ `fid` + `wallets` | ⚠️ Need auth integration | Ready |
| Onboarding state | ✅ `has_completed_onboarding` | ✅ `Onboarding.tsx` | Ready |
| Stack creation | ✅ `stacks` table | ✅ `CreateStackModal.tsx` | Ready |
| Stack viewing | ✅ `stacks` table | ✅ `StackCard.tsx` | Ready |
| Leaderboards | ✅ `leaderboards` table | ❌ Not built | DB Ready |
| Achievements | ✅ `achievements` tables | ❌ Not built | DB Ready |

## 🚀 SUMMARY

### What's Perfect:
✅ Core stack data structure matches perfectly
✅ All UI components use consistent types
✅ Database has all fields needed + extras for future
✅ Cross-platform identity system ready
✅ Onboarding tracking ready

### What Needs Fixing (5 minutes):
⚠️ Enum case sensitivity (Daily → daily)
⚠️ Add optional fields to SavingsStack interface

### What's Missing (Future phases):
❌ Leaderboard UI
❌ Achievements UI
❌ Notifications UI
❌ Full profile settings

### Verdict:
**The database schema is 100% ready for the current UI.**
**The UI just needs minor type updates to match database conventions.**

## 🎯 NEXT STEPS

1. Fix enum casing in `types/index.ts`
2. Add optional fields to `SavingsStack` interface
3. Proceed to Phase 1: Smart Contracts
4. Phase 2: Connect UI to Supabase
5. Phase 3: Build missing UI (leaderboards, achievements)
