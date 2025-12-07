# Fitness Tracker - Landing Page Design Specification

Complete design specification for creating a professional landing page in Figma that matches your mobile app's theme.

---

## Table of Contents
1. [Design System](#design-system)
2. [Page Structure](#page-structure)
3. [Section Specifications](#section-specifications)
4. [Copy & Content](#copy--content)
5. [Visual Assets Needed](#visual-assets-needed)
6. [Responsive Guidelines](#responsive-guidelines)
7. [Figma Implementation Guide](#figma-implementation-guide)

---

## Design System

### Colors

```
Primary Background:     #0A0E1A  (Deep Navy)
Surface/Cards:          #1E2433  (Dark Blue Gray)
Elevated Surface:       #252D3F  (Lighter variant)

Accent Primary:         #6366F1  (Vibrant Indigo)
Accent Light:           #818CF8  (Light Indigo)
Accent Purple:          #A855F7
Accent Pink:            #EC4899
Accent Orange:          #F97316

Success Green:          #10B981
Warning:                #F59E0B
Error Red:              #EF4444

Text Primary:           #FFFFFF  (White)
Text Secondary:         #D1D5DB  (Light Gray)
Text Muted:             #6B7280  (Gray)
```

### Typography

**Font Family:** Poppins (Import from Google Fonts)

```
Headings:
- H1 (Hero): Poppins ExtraBold, 72px, tracking -2%
- H2 (Section): Poppins Bold, 48px, tracking -1%
- H3 (Feature): Poppins Bold, 32px
- H4 (Subsection): Poppins SemiBold, 24px

Body:
- Large: Poppins Medium, 20px, line-height 1.6
- Regular: Poppins Regular, 16px, line-height 1.7
- Small: Poppins Regular, 14px, line-height 1.6

Buttons:
- Primary CTA: Poppins Bold, 18px
- Secondary: Poppins SemiBold, 16px
```

### Spacing System

```
XS:   8px
S:    16px
M:    24px
L:    32px
XL:   48px
2XL:  64px
3XL:  96px
4XL:  128px
```

### Border Radius

```
Small:   8px
Medium:  12px
Large:   16px
XLarge:  20px
2XL:     24px
Full:    9999px (Pills/Circles)
```

### Shadows

```
Glow Effect:       0 0 40px rgba(99, 102, 241, 0.3)
Glow Large:        0 0 60px rgba(99, 102, 241, 0.4)
Card Shadow:       0 8px 32px rgba(0, 0, 0, 0.4)
Elevated Shadow:   0 16px 48px rgba(0, 0, 0, 0.5)
```

---

## Page Structure

### Layout Overview

```
┌─────────────────────────────────────┐
│         Navigation Bar              │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│     (Full viewport height)          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Features Section               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Screenshots Showcase             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      AI Coach Feature               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     Pricing Section (Pro)           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Final CTA Section              │
│                                     │
├─────────────────────────────────────┤
│           Footer                    │
└─────────────────────────────────────┘
```

### Max Width
- Container: 1280px centered
- Content: 1120px for text-heavy sections

---

## Section Specifications

### 1. Navigation Bar

**Dimensions:**
- Height: 80px
- Background: rgba(10, 14, 26, 0.95) with backdrop-blur
- Position: Fixed/Sticky

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [Logo + Name]        [Download App Button] │
└─────────────────────────────────────────────┘
```

**Specifications:**
- Padding: 0 64px
- Logo: 40px height, with app icon
- App Name: Poppins Bold, 24px, White
- Download Button:
  - Background: Linear gradient (#6366F1 → #A855F7)
  - Padding: 12px 32px
  - Border radius: 12px
  - Text: Poppins Bold, 16px, White
  - Glow effect on hover

---

### 2. Hero Section

**Dimensions:**
- Height: 100vh (minimum 700px)
- Background: #0A0E1A with gradient overlay
- Gradient: Radial from center (#6366F1 15% opacity → transparent)

**Layout:**
```
┌───────────────────────────────────────────┐
│                                           │
│         Your AI-Powered                   │
│         Fitness Journey                   │
│         Starts Here                       │
│                                           │
│    Transform your workouts with           │
│    intelligent tracking and AI coaching   │
│                                           │
│    [Download on App Store Button]         │
│                                           │
│         ┌─────────────┐                   │
│         │             │                   │
│         │ iPhone Mock │                   │
│         │             │                   │
│         └─────────────┘                   │
└───────────────────────────────────────────┘
```

**Specifications:**

**Title:**
- Font: Poppins ExtraBold, 72px
- Color: White
- Line height: 1.1
- Letter spacing: -2%
- Gradient text effect: Linear (#FFFFFF → #818CF8)
- Max width: 800px

**Subtitle:**
- Font: Poppins Medium, 24px
- Color: #D1D5DB
- Line height: 1.6
- Max width: 600px
- Margin top: 24px

**CTA Button:**
- Background: Linear gradient (#6366F1 → #A855F7)
- Padding: 20px 48px
- Border radius: 16px
- Text: Poppins Bold, 20px
- Glow shadow: 0 0 40px rgba(99, 102, 241, 0.4)
- Margin top: 48px
- Hover: Scale 1.05, increased glow

**Phone Mockup:**
- Position: Right side or center bottom
- Size: 400px height
- Drop shadow: 0 32px 64px rgba(0, 0, 0, 0.6)
- Screenshot: App home screen

**Background Elements:**
- Floating gradient orbs (blur circles)
- Position: Random, absolute
- Colors: #6366F1, #A855F7, #EC4899 at 10% opacity
- Size: 200-400px
- Blur: 80px

---

### 3. Features Section

**Dimensions:**
- Padding: 128px 64px
- Background: #0A0E1A

**Section Header:**
- Title: "Everything You Need to Succeed"
- Font: Poppins Bold, 48px, White
- Subtitle: "Powerful features designed for your fitness journey"
- Font: Poppins Regular, 20px, #9CA3AF
- Text align: Center
- Margin bottom: 96px

**Feature Grid Layout:**
```
┌─────────────┬─────────────┬─────────────┐
│             │             │             │
│  Feature 1  │  Feature 2  │  Feature 3  │
│             │             │             │
├─────────────┼─────────────┼─────────────┤
│             │             │             │
│  Feature 4  │  Feature 5  │  Feature 6  │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

**Feature Card Specifications:**
- Background: #1E2433
- Border: 2px solid rgba(99, 102, 241, 0.2)
- Border radius: 24px
- Padding: 40px 32px
- Gap between cards: 32px
- Hover: Border becomes #6366F1 50%, lift with shadow

**Card Content:**

Icon Container:
- Background: rgba(99, 102, 241, 0.1)
- Size: 64px × 64px
- Border radius: 16px
- Icon: Material Icons, 32px, #6366F1
- Margin bottom: 24px

Title:
- Font: Poppins Bold, 24px, White
- Margin bottom: 12px

Description:
- Font: Poppins Regular, 16px, #9CA3AF
- Line height: 1.7

**Features to Include:**

1. **AI Fitness Coach**
   - Icon: robot-excited (brain/ai icon)
   - Color accent: #6366F1
   - Description: "Get instant answers to fitness questions with ChatGPT-5 powered coaching"

2. **Smart Workout Tracking**
   - Icon: fitness-center (dumbbell)
   - Color accent: #A855F7
   - Description: "Track sets, reps, and weights with an intuitive interface built for the gym"

3. **Custom Workouts**
   - Icon: edit (pencil)
   - Color accent: #EC4899
   - Description: "Create unlimited custom workouts tailored to your goals and preferences"

4. **Exercise Library**
   - Icon: library-books
   - Color accent: #F97316
   - Description: "Access hundreds of exercises with detailed instructions and form tips"

5. **Workout Templates**
   - Icon: content-copy
   - Color accent: #10B981
   - Description: "Quick-start your training with professionally designed workout templates"

6. **Progress Analytics**
   - Icon: trending-up
   - Color accent: #3B82F6
   - Description: "Visualize your strength gains and track progress over time"

---

### 4. Screenshots Showcase

**Dimensions:**
- Padding: 128px 64px
- Background: Gradient (#0A0E1A → #141925)

**Section Header:**
- Title: "Beautiful Design. Powerful Results."
- Font: Poppins Bold, 48px, White
- Text align: Center
- Margin bottom: 64px

**Screenshot Layout:**

Horizontal scroll carousel with 5-6 phone mockups:

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│      │  │      │  │      │  │      │  │      │
│ IMG1 │  │ IMG2 │  │ IMG3 │  │ IMG4 │  │ IMG5 │
│      │  │      │  │      │  │      │  │      │
└──────┘  └──────┘  └──────┘  └──────┘  └──────┘
 Workouts   AI Chat   Exercise  Template Progress
```

**Mockup Specifications:**
- iPhone 15 Pro frame
- Size: 300px width
- Shadow: 0 16px 48px rgba(0, 0, 0, 0.5)
- Gap: 40px between each
- Center mockup: Slightly larger (320px) with extra glow

**Screenshots to Include:**
1. Workouts home screen
2. AI Chatbot conversation
3. Exercise selection/creation
4. Workout in progress
5. Workout templates modal

**Captions:**
Under each mockup:
- Font: Poppins Medium, 14px, #9CA3AF
- Text examples: "Track Workouts", "AI Coach", "Exercise Library", etc.

---

### 5. AI Coach Feature Highlight

**Dimensions:**
- Padding: 128px 64px
- Background: #0A0E1A

**Layout:**
```
┌─────────────────────────────────────────┐
│  ┌──────────┐                           │
│  │          │    AI-Powered Coaching    │
│  │ Chatbot  │                           │
│  │Screenshot│    Your personal fitness  │
│  │          │    assistant, available   │
│  └──────────┘    24/7 to answer...      │
│                                          │
│                  [Feature bullets]       │
└─────────────────────────────────────────┘
```

**Two-column layout:**

Left: Phone mockup (600px)
Right: Content (500px)

**Content Specifications:**

Badge:
- Background: rgba(99, 102, 241, 0.15)
- Border: 1px solid rgba(99, 102, 241, 0.3)
- Padding: 8px 16px
- Border radius: 100px
- Text: "Powered by ChatGPT-5"
- Font: Poppins SemiBold, 12px, #6366F1
- Margin bottom: 24px

Title:
- Font: Poppins Bold, 48px, White
- Gradient text: Linear (#FFFFFF → #818CF8)
- Margin bottom: 24px

Description:
- Font: Poppins Regular, 18px, #D1D5DB
- Line height: 1.7
- Margin bottom: 40px

Feature List:
- Icon: Checkmark in circle (#10B981)
- Font: Poppins Medium, 16px, White
- Gap: 20px between items
- Items:
  - "Instant answers to any fitness question"
  - "Form tips and exercise guidance"
  - "Nutrition and meal planning advice"
  - "Motivation and accountability support"
  - "AI-generated workout plans"

---

### 6. Pricing Section (Pro Features)

**Dimensions:**
- Padding: 128px 64px
- Background: Gradient (#0A0E1A → #141925)

**Section Header:**
- Title: "Unlock Your Full Potential"
- Font: Poppins Bold, 48px, White
- Subtitle: "Upgrade to Pro for unlimited access"
- Font: Poppins Regular, 20px, #9CA3AF
- Text align: Center
- Margin bottom: 64px

**Pricing Card:**

**Layout:**
```
┌────────────────────────────────────┐
│         👑                         │
│                                    │
│         Pro Membership             │
│                                    │
│        $9.99/month                 │
│                                    │
│    ✓ Unlimited AI Requests         │
│    ✓ AI Workout Generator          │
│    ✓ Unlimited Workouts            │
│    ✓ Priority Support              │
│                                    │
│    [Download App to Subscribe]     │
└────────────────────────────────────┘
```

**Card Specifications:**
- Max width: 480px
- Background: #1E2433
- Border: 2px solid #6366F1
- Border radius: 24px
- Padding: 64px 48px
- Box shadow: 0 0 60px rgba(99, 102, 241, 0.3)
- Position: Center

**Elements:**

Crown Icon:
- Size: 64px
- Color: #EAB308 (Gold)
- Margin bottom: 24px

Title:
- Font: Poppins Bold, 32px, White
- Margin bottom: 16px

Price:
- Font: Poppins ExtraBold, 56px, #6366F1
- Margin bottom: 8px

Subtext:
- Font: Poppins Regular, 14px, #9CA3AF
- Text: "Cancel anytime. No commitments."
- Margin bottom: 40px

Feature List:
- Icon: Checkmark (#10B981)
- Font: Poppins Medium, 18px, White
- Gap: 20px
- Margin bottom: 48px

CTA Button:
- Background: Linear gradient (#EAB308 → #F59E0B)
- Padding: 18px 48px
- Border radius: 16px
- Text: "Get Started", Poppins Bold, 18px, Black
- Full width
- Hover: Lift + glow

---

### 7. Final CTA Section

**Dimensions:**
- Padding: 128px 64px
- Background: Radial gradient (#6366F1 20% opacity center → #0A0E1A)

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│    Ready to Transform Your      │
│         Fitness Journey?        │
│                                 │
│    Join thousands of users who  │
│    are achieving their goals    │
│                                 │
│    [Download on App Store]      │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**

Title:
- Font: Poppins ExtraBold, 56px, White
- Text align: Center
- Margin bottom: 24px

Subtitle:
- Font: Poppins Medium, 20px, #D1D5DB
- Text align: Center
- Margin bottom: 48px

CTA Button:
- Background: Linear gradient (#6366F1 → #A855F7)
- Padding: 24px 56px
- Border radius: 16px
- Text: "Download Now", Poppins Bold, 20px, White
- Glow shadow: 0 0 60px rgba(99, 102, 241, 0.5)
- Hover: Scale 1.05

**Background Elements:**
- Floating gradient orbs (same as hero)
- Animated subtle pulse effect

---

### 8. Footer

**Dimensions:**
- Padding: 64px 64px 32px
- Background: #0A0E1A
- Border top: 1px solid #1E2433

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Logo]                                 │
│  Your AI-powered fitness companion      │
│                                         │
│  Links:                                 │
│  • Privacy Policy                       │
│  • Terms of Service                     │
│  • Contact Support                      │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  © 2024 Fitness Tracker.                │
│  All rights reserved.                   │
└─────────────────────────────────────────┘
```

**Specifications:**

Logo + Tagline:
- Logo: 36px height
- Tagline: Poppins Regular, 16px, #6B7280
- Margin bottom: 32px

Links:
- Font: Poppins Medium, 14px, #9CA3AF
- Gap: 16px between links
- Hover: Color changes to #6366F1
- Margin bottom: 40px

Divider:
- Height: 1px
- Color: #1E2433
- Margin bottom: 24px

Copyright:
- Font: Poppins Regular, 14px, #6B7280
- Text align: Center

---

## Copy & Content

### Hero Section
**Headline Options:**
1. "Your AI-Powered Fitness Journey Starts Here"
2. "Transform Your Workouts with Intelligent Tracking"
3. "Meet Your Personal AI Fitness Coach"

**Subheadline:**
"Track workouts, get AI coaching, and achieve your fitness goals faster with the most intelligent fitness app."

### Feature Benefits

**Short descriptions for features:**
- "Chat with GPT-5 powered AI coach for instant fitness advice"
- "Create and track unlimited custom workouts"
- "Browse hundreds of exercises with detailed instructions"
- "Use professional workout templates to get started fast"
- "Monitor your progress with intuitive analytics"
- "Generate complete workout plans with AI"

### Social Proof (Optional)
If you have metrics:
- "Join 10,000+ users achieving their fitness goals"
- "4.8★ Rating on App Store"
- "1M+ workouts completed"

---

## Visual Assets Needed

### Screenshots (iPhone Mockups)
1. **Workouts Home Screen**
   - Shows workout list with "My Workouts"
   - Quick Start section visible
   - Clean, modern UI

2. **AI Chatbot Conversation**
   - Example chat showing AI response
   - Message bubbles visible
   - "AI Coach" header

3. **Exercise Selection**
   - Filter chips active
   - Exercise cards with body part badges
   - Search bar

4. **Create Workout Modal**
   - Step 2 of wizard
   - Selected exercises visible
   - Modern card design

5. **Workout Template**
   - Template list or preview
   - Exercise count visible
   - Professional layout

6. **Pro Benefits Modal** (Optional)
   - Crown icon
   - Benefits listed
   - Pricing visible

### Other Visual Elements
- App icon (high res, 1024×1024)
- iPhone 15 Pro mockup frame (black or graphite)
- App Store badge (official Apple download badge)

### Background Graphics
- Gradient orbs (create as blur circles)
- Optional: Abstract fitness illustrations
- Optional: Geometric patterns

---

## Responsive Guidelines

### Breakpoints

```
Desktop Large:  1440px+
Desktop:        1024px - 1439px
Tablet:         768px - 1023px
Mobile:         375px - 767px
```

### Layout Adjustments

**Hero Section:**
- Desktop: Text left, phone mockup right
- Mobile: Text center, phone below, smaller text (48px headline)

**Features Grid:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Screenshots:**
- Desktop: Horizontal scroll/carousel (5 visible)
- Tablet: Show 3, scroll for more
- Mobile: Show 1.5, swipe to scroll

**AI Feature Section:**
- Desktop: Two columns (image + text)
- Mobile: Stack vertically (image on top)

**Pricing:**
- Always centered, single card
- Mobile: Reduce padding

**Footer:**
- Desktop: Multi-column layout
- Mobile: Single column, center aligned

### Spacing Adjustments

Desktop → Mobile:
- 128px padding → 64px
- 64px padding → 32px
- 48px gaps → 24px

---

## Figma Implementation Guide

### Setup

1. **Create New Figma File**
   - Desktop size: 1440 × 1024 (hero frame)
   - Add artboards for different sections

2. **Set Up Styles**

**Color Styles:**
- Create color variables for all colors listed
- Name them: `Primary/Background`, `Accent/Indigo`, etc.

**Text Styles:**
- Import Poppins from Google Fonts
- Create text styles for H1, H2, H3, Body, etc.
- Name format: `Desktop/H1`, `Mobile/H1`, etc.

**Effect Styles:**
- Create glow effects as layer effects
- Card shadows
- Elevation shadows

3. **Components to Create**

**Button Component:**
- Variants: Primary (gradient), Secondary (outline)
- States: Default, Hover, Pressed
- Auto-layout with padding
- Text style variable

**Feature Card Component:**
- Auto-layout vertical
- Icon slot (instance swap)
- Title text
- Description text
- Hover state variant

**Phone Mockup Component:**
- iPhone frame
- Screenshot slot (instance swap)
- Shadow effect

**App Store Badge:**
- Download official SVG from Apple
- Make it a component for reuse

### Layout Tips

**Use Auto-Layout:**
- All sections should use auto-layout
- Set horizontal padding: 64px
- Set vertical padding: 128px for sections
- Gap between elements: Use spacing system

**Constraints:**
- Center content: Use horizontal auto + max-width constraint
- Phone mockups: Fixed width, centered
- Text: Max width 600-800px for readability

**Prototyping:**
- Add smooth scroll between sections
- Hover states for buttons and cards
- Click CTA → Modal overlay with "Coming Soon" or link to App Store

### Gradients

**Text Gradient:**
1. Select text
2. Fill → Linear gradient
3. Angle: -90° (top to bottom)
4. Stops: #FFFFFF (0%), #818CF8 (100%)

**Button Gradient:**
1. Select button background
2. Fill → Linear gradient
3. Angle: 135° (diagonal)
4. Stops: #6366F1 (0%), #A855F7 (100%)

**Background Radial Gradient:**
1. Create ellipse (large)
2. Fill → Radial gradient
3. Center: #6366F1 at 15% opacity
4. Edge: Transparent
5. Blur: 80px
6. Layer: Send to back

### Export Settings

**For Development:**
- Sections: Export as PNG @2x for preview
- Mockups: Export individual screenshots
- Assets: SVG for icons, PNG @2x for images
- Specs: Use Figma Inspect panel for CSS values

**Handoff:**
- Use Figma Dev Mode for developers
- Annotate key measurements
- Export asset pack with all images

---

## Additional Recommendations

### Animations (Future Enhancement)
- Fade-in on scroll for feature cards
- Gradient orbs: Slow floating animation
- Parallax scroll for phone mockups
- Button hover: Scale + glow increase

### SEO Considerations
When implementing in code:
- Use semantic HTML (h1, h2, section tags)
- Alt text for all images
- Meta description highlighting AI coach and features
- Open Graph tags for social sharing

### Accessibility
- Color contrast ratio: Ensure text meets WCAG AA
- Button focus states: Add outline
- Alt text: Descriptive for all images
- Text sizing: Allow browser zoom up to 200%

### Performance
- Optimize screenshots: Use WebP format
- Lazy load images below fold
- Use CSS gradients instead of images where possible
- Minimize mockup file sizes

---

## Quick Start Checklist

- [ ] Import Poppins font to Figma
- [ ] Set up color palette as styles
- [ ] Create text styles for all typography
- [ ] Design navigation bar
- [ ] Design hero section with gradient background
- [ ] Create feature card component
- [ ] Design all 6 feature cards
- [ ] Add iPhone mockups with screenshots
- [ ] Design AI coach highlight section
- [ ] Design pricing card with Pro features
- [ ] Create final CTA section
- [ ] Design footer
- [ ] Add gradients and glow effects
- [ ] Create hover states for interactive elements
- [ ] Set up responsive variants (desktop + mobile)
- [ ] Export assets for development

---

## Resources

### Figma Plugins to Use
- **Unsplash** - Stock photos for backgrounds
- **Iconify** - Material Icons pack
- **Angle** - For device mockups (iPhone frames)
- **Content Reel** - For placeholder text
- **Remove BG** - Clean up screenshots

### Reference Sites
- Apple.com (clean product page layouts)
- Stripe.com (excellent landing page design)
- Linear.app (modern dark theme inspiration)
- Figma.com (gradient usage, typography)

### App Store Badge
Download official badge:
https://developer.apple.com/app-store/marketing/guidelines/

---

## Next Steps

1. Create the Figma file following this spec
2. Take high-quality screenshots of your app
3. Remove backgrounds from iPhone screenshots
4. Add them to device mockups in Figma
5. Export final design as PNG for review
6. Implement in code (HTML/CSS or Next.js/React)
7. Deploy to web hosting
8. Link App Store button to your app listing

---

Good luck with your landing page! This spec should give you everything you need to create a professional, modern design in Figma that perfectly matches your mobile app's aesthetic.