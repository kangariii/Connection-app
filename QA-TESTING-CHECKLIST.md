# Quality Assurance Testing Checklist

## Pre-Deployment Testing Protocol

**CRITICAL:** Before pushing ANY changes to GitHub, complete ALL applicable tests below.

---

## 1. GAME MODE: DEEPEN YOUR CONNECTION

### Setup Flow
- [ ] Welcome screen → Click game mode card → Create/Join screen appears
- [ ] Create Game → Relationship selection appears
- [ ] Select relationship → Lobby screen appears
- [ ] Enter both player names → "Begin Journey" button enabled
- [ ] Click "Begin Journey" → Round 1 starts

### Round Progression (Test ALL 5 rounds)
- [ ] Round announcement appears and disappears
- [ ] Player name appears in turn indicator
- [ ] Category buttons are **clickable**
- [ ] Click category → Question appears
- [ ] Question text is readable and complete
- [ ] "Save Question" button works (heart fills)
- [ ] "Answer Complete" button is **clickable** and visible
- [ ] Click "Answer Complete" → Switches to other player
- [ ] After both players → "Round Complete" appears
- [ ] "Continue" button → Next round starts
- [ ] Round 5 complete → Game completion sequence

### Mobile Testing
- [ ] All screens scrollable on mobile
- [ ] Buttons not cut off at bottom
- [ ] Back button doesn't overlap title
- [ ] Progress bar visible during gameplay
- [ ] Progress bar HIDDEN during announcements

---

## 2. GAME MODE: COMPATIBILITY TEST

### Setup Flow
- [ ] Welcome → Select Compatibility mode → Create/Join screen
- [ ] Create Game → Relationship selection
- [ ] Select relationship → Lobby
- [ ] Enter names → Start game → Compatibility screen

### Question Flow (Test ALL 10 questions)
- [ ] Question 1 displays correctly
- [ ] Answer buttons are **CLICKABLE** (THIS IS CRITICAL)
- [ ] No invisible overlays blocking clicks
- [ ] Click answer → Visual feedback (button highlights)
- [ ] Progress bar updates (1/10, 2/10, etc.)
- [ ] After clicking → Proceeds to next question
- [ ] All 10 questions complete → Results screen

### Results Screen
- [ ] Score circle animates from 0 to final score
- [ ] Rating text displays (e.g., "Great Match!")
- [ ] Compatibility breakdown shows all categories
- [ ] Category bars animate
- [ ] Insights section displays strengths and growth areas
- [ ] "Share Results" button works
- [ ] "Start New Journey" button returns to welcome

### Offline Mode
- [ ] Player 1 answers → Alert for Player 2
- [ ] Player 2 can answer same question
- [ ] Both answers stored correctly
- [ ] Results calculate properly

---

## 3. GAME MODE: KNOWLEDGE QUIZ

### Setup Flow
- [ ] Welcome → Select Knowledge mode → Create/Join screen
- [ ] Create Game → Relationship selection
- [ ] Select relationship → Lobby
- [ ] Enter names → Start game → Knowledge screen

### Question Flow (Test at least 5 questions)
- [ ] Score bar shows both players with correct names
- [ ] Question 1/15 displays
- [ ] **ANSWER PHASE**: Buttons are **CLICKABLE**
- [ ] Click answer → Visual feedback
- [ ] Answer stored → Proceeds to predict phase
- [ ] **PREDICT PHASE**: Buttons are **CLICKABLE**
- [ ] Prediction stored → Shows result
- [ ] **RESULT PHASE**: Shows correct/incorrect icon
- [ ] "The answer was: [X]" displays correctly
- [ ] Scores update in real-time
- [ ] "Continue" button proceeds to next question
- [ ] Players alternate answering (P1, P2, P1, P2...)

### Results Screen
- [ ] Final scores display correctly
- [ ] Percentages calculate correctly
- [ ] Winner announcement correct
- [ ] "Share Results" button works
- [ ] "Play Again" button returns to welcome

---

## 4. CRITICAL UI/UX CHECKS

### Z-Index & Overlays
- [ ] **Round announcements don't block clicks when hidden**
- [ ] No invisible overlays covering buttons
- [ ] Progress bar doesn't interfere with clicks
- [ ] Modal overlays have correct z-index

### Button Clickability (MOST COMMON BUG)
- [ ] Test EVERY button on EVERY screen
- [ ] Buttons have `cursor: pointer`
- [ ] Buttons not blocked by `pointer-events: none`
- [ ] Buttons have proper `onclick` or event listeners
- [ ] No overlapping elements blocking clicks

### Mobile Responsiveness
- [ ] Test on actual mobile device (not just browser DevTools)
- [ ] All content fits within viewport
- [ ] Scrolling works everywhere
- [ ] Buttons not cut off at screen edges
- [ ] Touch targets large enough (44x44px minimum)

---

## 5. MULTIPLAYER/FIREBASE TESTING

### Create/Join Flow
- [ ] Create game → Room code appears
- [ ] Room code copyable/shareable
- [ ] Join game → Enter room code → Joins successfully
- [ ] Both players see each other's names
- [ ] Game mode synced to joining player
- [ ] Relationship type synced to joining player

### Online Gameplay
- [ ] Player 1 makes move → Player 2 sees update
- [ ] Player 2 makes move → Player 1 sees update
- [ ] Waiting states show when not your turn
- [ ] No race conditions or state conflicts
- [ ] Disconnect handling works

---

## 6. CROSS-BROWSER TESTING

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (desktop)
- [ ] Safari (iOS/iPhone)
- [ ] Chrome (Android)

---

## 7. EDGE CASES

- [ ] Back button at each screen goes to correct previous screen
- [ ] Restart game resets ALL state variables
- [ ] Play multiple games in a row without refresh
- [ ] Rapid clicking doesn't break state
- [ ] Empty inputs handled gracefully
- [ ] Invalid room codes show error message

---

## 8. CONSOLE LOG CHECKS

### Before Pushing:
1. Open browser console (F12)
2. Play through entire game
3. Check for:
   - [ ] No JavaScript errors (red text)
   - [ ] No failed network requests
   - [ ] No infinite loops
   - [ ] Warnings are acceptable (yellow), errors are NOT

---

## 9. AUTOMATED TESTING SCRIPT

### Quick Test Commands:
```javascript
// Paste in browser console to quick-test clickability

// Test if element is clickable
function testClickable(selector) {
  const el = document.querySelector(selector);
  if (!el) return console.error(`❌ Element not found: ${selector}`);

  const style = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  console.log(`Testing: ${selector}`);
  console.log(`- Display: ${style.display}`);
  console.log(`- Visibility: ${style.visibility}`);
  console.log(`- Pointer Events: ${style.pointerEvents}`);
  console.log(`- Z-Index: ${style.zIndex}`);
  console.log(`- Position: ${rect.top}, ${rect.left}`);

  if (style.pointerEvents === 'none') console.error(`❌ pointer-events: none!`);
  if (style.visibility === 'hidden') console.error(`❌ visibility: hidden!`);
  if (style.display === 'none') console.error(`❌ display: none!`);

  console.log(`✅ Element appears clickable\n`);
}

// Test all critical buttons
testClickable('.game-mode-card');
testClickable('.compatibility-answer-btn');
testClickable('.knowledge-option-btn');
testClickable('.category-btn');
testClickable('.main-btn');
```

---

## 10. PRE-COMMIT CHECKLIST

Before running `git commit`:
- [ ] Tested the specific feature you changed
- [ ] Tested complete user flow for affected mode
- [ ] Checked browser console for errors
- [ ] Tested on mobile (or responsive view)
- [ ] No breaking changes to other modes
- [ ] All buttons clickable
- [ ] No z-index/overlay issues

---

## Bug Prevention Guidelines

### Common Mistakes to Avoid:

1. **Overlay Blocking Clicks**
   - Always add `pointer-events: none` to hidden overlays
   - Check z-index of fixed/absolute elements
   - Test clicks immediately after implementing

2. **Event Handlers Not Attached**
   - Verify `onclick` attributes in HTML
   - Check event listeners in JavaScript
   - Test in browser console: `element.onclick`

3. **CSS Visibility Issues**
   - `display: none` removes from layout
   - `visibility: hidden` keeps space but hides
   - `opacity: 0` is visible but transparent
   - Use correct one for your use case

4. **State Not Resetting**
   - Always reset game mode variables in `restartGame()`
   - Clear arrays/objects between games
   - Test playing twice without refresh

5. **Mobile Scrolling**
   - Never use `position: fixed` with `height: 100vh` on content
   - Use `min-height` instead of `height`
   - Add `overflow-y: auto` where needed

---

## Testing Timeline

- **Minor CSS tweaks**: Quick visual check (5 min)
- **New feature**: Full mode testing (15-20 min)
- **Major refactor**: All modes + mobile (30-45 min)
- **Pre-release**: Complete checklist (1-2 hours)

---

## Report Template

When reporting bugs to yourself in comments:

```javascript
// BUG: [Component] - [Issue]
// Repro: [Steps to reproduce]
// Expected: [What should happen]
// Actual: [What actually happens]
// Fix: [How to fix]
```

Example:
```javascript
// BUG: Compatibility Test - Buttons not clickable
// Repro: Start compatibility test, try to click answer buttons
// Expected: Button should respond to click and select answer
// Actual: Buttons don't respond, no click event fires
// Fix: round-announcement overlay has z-index:1000 and doesn't have pointer-events:none when hidden
```
