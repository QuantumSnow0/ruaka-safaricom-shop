// Quick test to check agent status in database
// Run this in your browser console on the customer page

// Test 1: Check current agent status
async function checkAgentStatus() {
  try {
    const response = await fetch(
      "https://jvrqdpiuixdeeofazqfu.supabase.co/rest/v1/chat_agents?select=id,name,status",
      {
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cnFkcGl1aXhkZWVvZmF6cWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTgxNzAsImV4cCI6MjA3MzI3NDE3MH0.qiDv-3jINRTVJzi_t21UsfM05LahKmo_59sNbsZ2rMo",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cnFkcGl1aXhkZWVvZmF6cWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTgxNzAsImV4cCI6MjA3MzI3NDE3MH0.qiDv-3jINRTVJzi_t21UsfM05LahKmo_59sNbsZ2rMo",
        },
      }
    );

    const agents = await response.json();
    console.log("Current agent status:", agents);
    return agents;
  } catch (error) {
    console.error("Error checking agent status:", error);
  }
}

// Run the test
checkAgentStatus();

