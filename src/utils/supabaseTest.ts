import { supabase } from "@/integrations/supabase/client";

export async function testSupabaseConnection() {
  try {
    console.log("=== SUPABASE CONNECTION TEST ===");
    
    // Test 1: Verify environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    
    console.log("📋 Environment Variables:");
    console.log("  - VITE_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
    console.log("  - VITE_SUPABASE_PUBLISHABLE_KEY:", supabaseKey ? "✅ Set" : "❌ Missing");
    console.log("  - VITE_SUPABASE_PROJECT_ID:", projectId);
    console.log("  - Full URL:", supabaseUrl);
    
    // Test 2: Check if client is initialized
    console.log("\n🔌 Supabase Client:", supabase ? "✅ Initialized" : "❌ Not initialized");
    
    // Test 3: Query profiles table
    console.log("\n🔍 Testing database connection...");
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error("❌ Database query failed:", error.message);
      console.error("   Error details:", error);
      return { success: false, error };
    }
    
    console.log("✅ Database connection successful!");
    console.log(`📊 Found ${data?.length || 0} profiles in the database`);
    if (data && data.length > 0) {
      console.log("   Sample profile:", data[0]);
    }
    
    console.log("\n=== TEST COMPLETE ===\n");
    return { success: true, data };
  } catch (err) {
    console.error("❌ Connection test failed with exception:", err);
    return { success: false, error: err };
  }
}

// Auto-run test when imported
testSupabaseConnection();
