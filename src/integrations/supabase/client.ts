// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://doypdbfrjdqnghiznrfh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveXBkYmZyamRxbmdoaXpucmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5ODUyMDYsImV4cCI6MjA0ODU2MTIwNn0.OyqF-HLTpgpc9bt71i9Bri4YO5Wyg5GDC_xBeaqM8hk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);