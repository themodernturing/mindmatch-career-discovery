-- Career Assessment Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  age INTEGER CHECK (age >= 14 AND age <= 100),
  gender VARCHAR(50),
  education_level VARCHAR(50),
  school_name VARCHAR(255),
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_section INTEGER DEFAULT 1,
  current_question INTEGER DEFAULT 1,
  total_questions INTEGER DEFAULT 100,
  time_spent_seconds INTEGER DEFAULT 0
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  question_id INTEGER NOT NULL,
  response_value INTEGER CHECK (response_value >= 1 AND response_value <= 5),
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Score profiles table
CREATE TABLE IF NOT EXISTS score_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  
  -- RIASEC scores (0-100)
  riasec_realistic DECIMAL(5,2),
  riasec_investigative DECIMAL(5,2),
  riasec_artistic DECIMAL(5,2),
  riasec_social DECIMAL(5,2),
  riasec_enterprising DECIMAL(5,2),
  riasec_conventional DECIMAL(5,2),
  
  -- Big Five scores (0-100)
  big5_openness DECIMAL(5,2),
  big5_conscientiousness DECIMAL(5,2),
  big5_extraversion DECIMAL(5,2),
  big5_agreeableness DECIMAL(5,2),
  big5_emotional_stability DECIMAL(5,2),
  
  -- Strength scores
  strength_analytical_thinking DECIMAL(5,2),
  strength_creativity DECIMAL(5,2),
  strength_leadership DECIMAL(5,2),
  strength_empathy DECIMAL(5,2),
  strength_organization DECIMAL(5,2),
  strength_communication DECIMAL(5,2),
  
  -- Work style scores
  work_independence DECIMAL(5,2),
  work_structure DECIMAL(5,2),
  work_pace DECIMAL(5,2),
  
  -- Motivation scores
  motivation_achievement DECIMAL(5,2),
  motivation_helping DECIMAL(5,2),
  motivation_autonomy DECIMAL(5,2),
  motivation_financial DECIMAL(5,2),
  motivation_creativity DECIMAL(5,2),
  motivation_work_life_balance DECIMAL(5,2),
  
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Career matches table
CREATE TABLE IF NOT EXISTS career_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score_profile_id UUID REFERENCES score_profiles(id) ON DELETE CASCADE,
  career_id VARCHAR(50) NOT NULL,
  overall_match DECIMAL(5,2) NOT NULL,
  riasec_score DECIMAL(5,2),
  personality_score DECIMAL(5,2),
  strength_score DECIMAL(5,2),
  work_style_score DECIMAL(5,2),
  motivation_score DECIMAL(5,2),
  rank INTEGER NOT NULL,
  is_saved BOOLEAN DEFAULT false,
  is_exploring BOOLEAN DEFAULT false,
  is_pursuing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Coach conversations table
CREATE TABLE IF NOT EXISTS coach_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- Coach messages table
CREATE TABLE IF NOT EXISTS coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES coach_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  intent VARCHAR(50),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Action plans table
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  career_id VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_score_profiles_user_id ON score_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_user_id ON career_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_score_profile_id ON career_matches(score_profile_id);
CREATE INDEX IF NOT EXISTS idx_coach_conversations_user_id ON coach_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_messages_conversation_id ON coach_messages(conversation_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Assessments policies
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Responses policies
CREATE POLICY "Users can view own responses" ON responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM assessments WHERE id = responses.assessment_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own responses" ON responses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM assessments WHERE id = responses.assessment_id AND user_id = auth.uid())
  );

-- Score profiles policies
CREATE POLICY "Users can view own score profiles" ON score_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own score profiles" ON score_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Career matches policies
CREATE POLICY "Users can view own career matches" ON career_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own career matches" ON career_matches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career matches" ON career_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coach conversations policies
CREATE POLICY "Users can view own conversations" ON coach_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON coach_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coach messages policies
CREATE POLICY "Users can view own messages" ON coach_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM coach_conversations WHERE id = coach_messages.conversation_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own messages" ON coach_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM coach_conversations WHERE id = coach_messages.conversation_id AND user_id = auth.uid())
  );

-- Action plans policies
CREATE POLICY "Users can view own action plans" ON action_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own action plans" ON action_plans
  FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update assessment progress
CREATE OR REPLACE FUNCTION update_assessment_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assessments 
  SET current_question = NEW.question_id + 1,
      time_spent_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::INTEGER
  WHERE id = NEW.assessment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for response insertion
DROP TRIGGER IF EXISTS after_response_insert ON responses;
CREATE TRIGGER after_response_insert
  AFTER INSERT ON responses
  FOR EACH ROW EXECUTE FUNCTION update_assessment_progress();

-- Function to complete assessment
CREATE OR REPLACE FUNCTION complete_assessment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assessments
  SET status = 'completed',
      completed_at = CURRENT_TIMESTAMP
  WHERE id = NEW.assessment_id AND NEW.question_id = 100;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for assessment completion
DROP TRIGGER IF EXISTS after_assessment_complete ON responses;
CREATE TRIGGER after_assessment_complete
  AFTER INSERT ON responses
  FOR EACH ROW EXECUTE FUNCTION complete_assessment();
