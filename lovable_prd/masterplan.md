## masterplan.md

### 🚀 30-Second Elevator Pitch  
A dating app where users express themselves by answering daily prompts. Profiles stay fresh, matches feel timely, and only active users show up in the swipe feed. Invite-only entry builds curiosity and keeps quality high.

### ❓ Problem & Mission  
Most dating profiles go stale and feel over-curated. This app encourages users to show who they are *today* through short, timely prompts—sparking more relevant matches and real conversation starters.

### 🎯 Target Audience  
- People who find typical dating apps repetitive or performative  
- Users who enjoy expressive, short-form sharing  
- Early adopters drawn to invite-only experiences  
- Communities of friends or campus groups who want dating to feel more “live”  

### 🧩 Core Features (MVP)  
- **Invite-Only Sign-Up**  
  - Unique links sent by text or email  
  - Users get limited invites to share  
- **Daily Prompts**  
  - One shared question each day  
  - Latest 7 answers form a user’s profile  
- **Swipe-Based Matching**  
  - Users swipe on others’ prompt responses  
  - Only users active in the last 7 days appear in the feed  
  - Inactive users can’t like new profiles  
- **Messaging After Match**  
  - Basic 1-on-1 chat unlocks after mutual likes  

### 🛠 High-Level Tech Stack  
- **iOS App (SwiftUI)** – Native performance and seamless Apple integration  
- **Backend:** Supabase – Real-time sync, database, and auth-friendly  
- **Auth:** Phone number + Apple ID  
- **Storage:** Supabase Storage for prompt responses (text now, media later)  
- **Invite System:** Custom Supabase function for generating, tracking, and gating via invite links  

### 🧠 Conceptual Data Model (ERD in words)  
- `User`, `Prompt`, `Response`, `Match`, `Message`, `InviteLink`  

### 🧭 UI Design Principles  
- Card-based layout  
- Prompt = heartbeat of the app  
- No clutter or passive profiles  
- One-clear-action-per-screen  

### 🔒 Security & Compliance Notes  
- Strong auth (Apple ID/phone)  
- Inactive profiles don’t surface  
- Moderation in V1  

### 🗺 Phased Roadmap  
#### MVP  
- Phone/Apple login  
- Invite-only  
- Daily prompts  
- Swipe + match + chat  
#### V1  
- AI moderation  
- Media in prompts  
- Admin + report tools  
#### V2+  
- Friend circles, themes, reactions

### ⚠️ Risks & Mitigations  
- Low engagement → streaks/reminders  
- Spam/inappropriate content → invite gating + moderation  
- Churn → swipe feed depends on daily activity  

### 🌱 Future Expansion Ideas  
- Prompt galleries  
- Creator campaigns  
- Anonymous modes  
