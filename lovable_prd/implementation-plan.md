## implementation-plan.md

### 🏗 Step-by-Step Build Sequence (MVP)

#### Auth & Access
- Apple Sign-In + phone auth  
- Invite-only flow (send + redeem + track links)  

#### Prompt System
- Admin tool to post daily prompt  
- Users can view/respond  
- Limit profile display to 7 most recent  

#### Profile Logic
- Profiles = latest 7 responses  
- No response in 7+ days = hidden from feed and can't swipe  

#### Matching & Feed
- Swipe interface  
- Filter only active users  
- Match logic (mutual right swipe)  

#### Messaging
- Basic 1-on-1 chat per match  
- Unmatch = remove chat  

#### Admin Tools (basic)
- View users + invites  
- Flag/review content *(in V1)*  

---

### ⏱ Timeline (Sample)

| Week | Goal |
|------|------|
| 1    | Auth + invites working  
| 2    | Prompt system live  
| 3    | Profile logic  
| 4    | Feed + swipe  
| 5    | Match + chat  
| 6–8  | Polish + beta + TestFlight  

---

### 👥 Team Roles & Rituals

| Role          | Focus |
|---------------|-------|
| Founder       | Prompt curation, product decisions  
| iOS Dev       | Frontend + basic backend  
| Backend Dev   | Auth, match logic, invite tracking  
| Design (freelance) | UI polish  

**Rituals:**  
- Weekly usability test  
- Daily async build updates  

---

### 🌟 Stretch Goals (V1+)
- AI moderation  
- Media in prompt replies  
- Push notifications  
- Prompt streaks  
