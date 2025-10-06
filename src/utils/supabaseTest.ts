import { supabase } from "@/integrations/supabase/client";

export async function testSupabaseConnection() {
  try {
    console.log("🔍 Testing Supabase connection...");
    
    // Test 1: Check if client is initialized
    console.log("✅ Supabase client initialized");
    
    // Test 2: Query profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error("❌ Error querying profiles:", error.message);
      return { success: false, error };
    }
    
    console.log("✅ Successfully connected to Supabase!");
    console.log(`📊 Found ${data?.length || 0} profiles:`, data);
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Connection test failed:", err);
    return { success: false, error: err };
  }
}

// Auto-run test when imported
testSupabaseConnection();
