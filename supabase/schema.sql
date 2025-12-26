-- Database Schema for Stack (Supabase/PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Stores profile information linked to Farcaster ID (FID)
CREATE TABLE users (
    fid BIGINT PRIMARY KEY, -- Farcaster ID is the primary identifier
    username TEXT,
    display_name TEXT,
    pfp_url TEXT,
    bio TEXT,
    primary_wallet TEXT, -- Address of the main connected wallet
    
    -- Onboarding & Preferences (Cross-Platform)
    has_completed_onboarding BOOLEAN DEFAULT false,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    preferred_platform TEXT, -- 'farcaster', 'base', 'web' - where they first signed up
    
    -- User Preferences
    notification_preferences JSONB DEFAULT '{"milestones": true, "reminders": true, "social": true}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. WALLETS TABLE
-- Links multiple wallets to a single user (FID)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
    address TEXT NOT NULL,
    chain_id INTEGER NOT NULL DEFAULT 8453, -- Default to Base
    is_primary BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE, -- When we proved ownership via signature
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(address, chain_id) -- Prevent duplicate wallet entries
);

-- 3. STACKS TABLE
-- Stores the configuration and metadata for savings stacks
-- Note: verified_contract_stack_id links this to the Blockchain data
CREATE TABLE stacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL, -- The wallet funding this stack
    
    -- Stack Details
    name TEXT NOT NULL,
    emoji TEXT DEFAULT '💰',
    target_amount NUMERIC(20, 2) NOT NULL, -- Using numeric for financial precision
    current_amount NUMERIC(20, 2) DEFAULT 0,
    
    -- Configuration
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    amount_per_pull NUMERIC(20, 2) NOT NULL,
    asset_symbol TEXT DEFAULT 'USDC',
    asset_address TEXT, -- Contract address of the token (USDC)
    
    -- Dates & Status
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('active', 'completed', 'broken')) DEFAULT 'active',
    
    -- Blockchain Link
    contract_stack_id BIGINT, -- The ID assigned by the Smart Contract
    tx_hash TEXT, -- The transaction that created this stack
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TRANSACTIONS TABLE
-- Off-chain record of on-chain events (for faster UI history)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stack_id UUID REFERENCES stacks(id) ON DELETE SET NULL,
    fid BIGINT REFERENCES users(fid),
    
    tx_hash TEXT NOT NULL,
    type TEXT CHECK (type IN ('create', 'deposit', 'withdrawal', 'break', 'yield')),
    amount NUMERIC(20, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')) DEFAULT 'pending',
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('milestone', 'reminder', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. LEADERBOARDS & STATS
-- Aggregated data for fast ranking and profile display
CREATE TABLE leaderboards (
    fid BIGINT PRIMARY KEY REFERENCES users(fid) ON DELETE CASCADE,
    username TEXT, -- Cached for faster leaderboard rendering
    
    total_saved NUMERIC(20, 2) DEFAULT 0,
    total_stacks_created INTEGER DEFAULT 0,
    total_stacks_completed INTEGER DEFAULT 0,
    
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    
    rank_global INTEGER, -- Updated by scheduled job
    rank_weekly INTEGER,
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. ACHIEVEMENTS
-- Gamification system (Badges)
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- e.g. 'first_stack', 'saver_100'
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    points INTEGER DEFAULT 10
);

-- 8. USER ACHIEVEMENTS
-- Tracks who earned what
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(fid, achievement_id)
);

-- ============================================================================
-- INDEXES (Critical for Performance)
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_primary_wallet ON users(primary_wallet);

-- Wallets indexes
CREATE INDEX idx_wallets_fid ON wallets(fid);
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_wallets_is_primary ON wallets(is_primary) WHERE is_primary = true;

-- Stacks indexes
CREATE INDEX idx_stacks_fid ON stacks(fid);
CREATE INDEX idx_stacks_wallet_address ON stacks(wallet_address);
CREATE INDEX idx_stacks_status ON stacks(status);
CREATE INDEX idx_stacks_contract_id ON stacks(contract_stack_id);
CREATE INDEX idx_stacks_created_at ON stacks(created_at DESC);

-- Transactions indexes
CREATE INDEX idx_transactions_stack_id ON transactions(stack_id);
CREATE INDEX idx_transactions_fid ON transactions(fid);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Notifications indexes
CREATE INDEX idx_notifications_fid ON notifications(fid);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Leaderboards indexes
CREATE INDEX idx_leaderboards_rank_global ON leaderboards(rank_global) WHERE rank_global IS NOT NULL;
CREATE INDEX idx_leaderboards_total_saved ON leaderboards(total_saved DESC);

-- User achievements indexes
CREATE INDEX idx_user_achievements_fid ON user_achievements(fid);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- ============================================================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stacks_updated_at BEFORE UPDATE ON stacks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = fid::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = fid::text);

-- Users can insert their own profile (signup)
CREATE POLICY "Users can create profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = fid::text);

-- ============================================================================
-- WALLETS POLICIES
-- ============================================================================

-- Users can view their own wallets
CREATE POLICY "Users can view own wallets" ON wallets
    FOR SELECT USING (fid::text = auth.uid()::text);

-- Users can add wallets to their account
CREATE POLICY "Users can add wallets" ON wallets
    FOR INSERT WITH CHECK (fid::text = auth.uid()::text);

-- Users can update their own wallets
CREATE POLICY "Users can update own wallets" ON wallets
    FOR UPDATE USING (fid::text = auth.uid()::text);

-- Users can delete their own wallets
CREATE POLICY "Users can delete own wallets" ON wallets
    FOR DELETE USING (fid::text = auth.uid()::text);

-- ============================================================================
-- STACKS POLICIES
-- ============================================================================

-- Users can view their own stacks
CREATE POLICY "Users can view own stacks" ON stacks
    FOR SELECT USING (fid::text = auth.uid()::text);

-- Users can create stacks
CREATE POLICY "Users can create stacks" ON stacks
    FOR INSERT WITH CHECK (fid::text = auth.uid()::text);

-- Users can update their own stacks
CREATE POLICY "Users can update own stacks" ON stacks
    FOR UPDATE USING (fid::text = auth.uid()::text);

-- Users can delete their own stacks
CREATE POLICY "Users can delete own stacks" ON stacks
    FOR DELETE USING (fid::text = auth.uid()::text);

-- ============================================================================
-- TRANSACTIONS POLICIES
-- ============================================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (fid::text = auth.uid()::text);

-- Only backend can insert transactions (via service role)
-- No INSERT policy for regular users

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (fid::text = auth.uid()::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (fid::text = auth.uid()::text);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (fid::text = auth.uid()::text);

-- ============================================================================
-- LEADERBOARDS POLICIES (PUBLIC READ)
-- ============================================================================

-- Everyone can view leaderboards
CREATE POLICY "Public view of leaderboards" ON leaderboards
    FOR SELECT USING (true);

-- Only backend can update leaderboards (via service role)

-- ============================================================================
-- ACHIEVEMENTS POLICIES (PUBLIC READ)
-- ============================================================================

-- Everyone can view achievements catalog
CREATE POLICY "Public view of achievements" ON achievements
    FOR SELECT USING (true);

-- ============================================================================
-- USER ACHIEVEMENTS POLICIES (PUBLIC READ)
-- ============================================================================

-- Everyone can view user achievements (for profile badges)
CREATE POLICY "Public view of user achievements" ON user_achievements
    FOR SELECT USING (true);

-- Only backend can grant achievements (via service role)
