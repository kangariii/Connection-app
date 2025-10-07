# Testing Guide for Who Are You? Game

## How to Test Properly

### 1. Open Browser Console
- **Chrome/Safari on Mobile**: Connect your phone to computer, use remote debugging
- **Or use Desktop**: Right-click → Inspect → Console tab
- Keep console open while testing to see all error messages

### 2. Complete Game Flow Test

**Start a Game:**
1. Open the app
2. Click "Create Game"
3. Select a relationship type (e.g., "Best Friends (Same Gender)")
4. Enter Player 1 name → Click "Begin Journey"
5. **Check console** - should see: "Game started" messages

**Round 1:**
1. Select category (e.g., "Favorites")
2. **Check console** - should see: "SELECT CATEGORY CALLED", "Question retrieved: YES"
3. **Verify question displays** on screen with category name
4. Click "Next" button
5. **Check**: Button should be visible (not cut off at bottom)
6. **Verify**: Turn switches to Player 2 or shows "Round Complete"

**Round 2-5:**
1. Repeat for all 5 rounds
2. **For each category selection, check console for:**
   - "SELECT CATEGORY CALLED"
   - "Question retrieved: YES"
   - "Question displayed successfully ✓"
3. **If you see "Question retrieved: NO"** - This is the bug! Screenshot the console and note:
   - Which round?
   - Which category?
   - Which relationship type?

### 3. Scrolling Test

**On Mobile:**
1. Go to "Create Game" → "Family" relationship dropdown
2. **Try to scroll** - should see all 14 family relationship options
3. **Verify** you can reach the bottom options (Male & Female Cousins)
4. Click one → **Check**: Back button doesn't overlap title
5. **Scroll down** - verify "Begin Journey" button is fully visible

**On Each Screen:**
- Welcome Screen
- Relationship Selection
- Join Game
- Game Screen (all 5 rounds)
- Complete Screen

### 4. Common Issues to Report

**Question doesn't show:**
- Open console before it happens again
- Screenshot the console logs
- Note: Round #, Category name, Relationship type

**Button cut off:**
- Screenshot showing which button
- Note: Screen name, mobile browser type

**Can't scroll:**
- Note: Which screen, what content is hidden

### 5. Console Error Messages

Look for these in console:
- ✅ **Good**: "Question displayed successfully ✓"
- ❌ **Bad**: "CRITICAL ERROR: No question found"
- ❌ **Bad**: "ERROR: Question display elements not found"
- ❌ **Bad**: "No data found for category"

## What I Fixed

### Bottom Padding (Buttons Cut Off)
- Added 80px bottom padding to all screens
- Added 100px bottom padding on mobile (768px)
- Added 120px bottom padding on small mobile (480px)
- Added margin-bottom to containers

### Enhanced Logging
- Added detailed console logs for question selection
- Shows when question retrieval fails
- Shows when display elements are missing
- Easier to debug issues now

### Error Handling
- Now shows alert if question is empty
- Won't try to display broken questions
- Better error messages for debugging

## How to Share Issues

When reporting bugs, include:
1. **Screenshot of console** (most important!)
2. Device type (iPhone X, Pixel 6, etc.)
3. Browser (Chrome, Safari, etc.)
4. Exact steps to reproduce
5. Which round and category

## Testing Checklist

- [ ] Splash screen shows then transitions
- [ ] Create game flow works
- [ ] All relationship types load questions
- [ ] Round 1: All 3 categories show questions
- [ ] Round 2: All 3 categories show questions
- [ ] Round 3: All 3 categories show questions
- [ ] Round 4: All 3 categories show questions
- [ ] Round 5: All 3 categories show questions
- [ ] All buttons visible on mobile (not cut off)
- [ ] Can scroll on all screens
- [ ] Back button doesn't overlap titles
- [ ] Complete game without errors
