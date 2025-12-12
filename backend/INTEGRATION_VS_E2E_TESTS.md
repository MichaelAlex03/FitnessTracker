# Integration Tests vs End-to-End (E2E) Tests

## Quick Comparison

| Aspect | Integration Tests | E2E Tests |
|--------|------------------|-----------|
| **Scope** | Backend components working together | Entire system (frontend + backend + database) |
| **Entry Point** | HTTP API endpoints | User interface (mobile app) |
| **Tools** | Supertest, Jest | Detox, Appium, Cypress |
| **Database** | Test database | Test database or mocked |
| **External Services** | Usually mocked | Can be real or mocked |
| **Speed** | Fast (seconds) | Slow (minutes) |
| **Environment** | Node.js test runner | Real device/simulator |
| **What You Test** | API contracts, business logic | User workflows, UI interactions |

## Visual Example: Login Flow

### Integration Test (Backend Only)
```
Test Runner → HTTP Request → Express Server → Controller → Database → Response
     ↑                                                                    ↓
     └─────────────────── Assertion (status, JSON) ──────────────────────┘
```

```javascript
// Integration test - Testing the backend API
test('should login user with valid credentials', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@test.com',
      pwd: 'password123'
    })
    .expect(200);

  expect(response.body).toHaveProperty('accessToken');
  expect(response.body).toHaveProperty('refreshToken');
});
```

### E2E Test (Full Stack)
```
Test Runner → Mobile App UI → User Taps Login → Form Submission →
HTTP Request → Backend API → Database → Response → UI Update → Screen Change
     ↑                                                                    ↓
     └──────────── Assertion (verify user sees home screen) ─────────────┘
```

```javascript
// E2E test - Testing through the mobile app UI
test('user can login through the app', async () => {
  // Launch the app
  await device.launchApp();

  // Interact with UI elements
  await element(by.id('email-input')).typeText('test@test.com');
  await element(by.id('password-input')).typeText('password123');
  await element(by.id('login-button')).tap();

  // Verify UI changes
  await expect(element(by.id('home-screen'))).toBeVisible();
  await expect(element(by.text('Welcome back!'))).toBeVisible();
});
```

## Concrete Examples for Your Fitness Tracker

### Example 1: Creating a Workout

**Integration Test** - Tests backend API only
```javascript
// Tests: POST /api/workouts endpoint
test('should create a new workout via API', async () => {
  const response = await request(app)
    .post('/api/workouts')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      userId: 1,
      workoutName: 'Push Day',
      exercises: [{ exerciseId: 5, exerciseName: 'Bench Press' }]
    })
    .expect(201);

  expect(response.body.workoutId).toBeDefined();

  // Verify in database
  const workout = await pg.getWorkout(response.body.workoutId);
  expect(workout.workout_name).toBe('Push Day');
});
```

**E2E Test** - Tests entire user flow through app
```javascript
// Tests: User journey from app launch to workout creation
test('user can create a workout through the app', async () => {
  await device.launchApp();

  // Login
  await element(by.id('email-input')).typeText('test@test.com');
  await element(by.id('password-input')).typeText('password123');
  await element(by.id('login-button')).tap();

  // Navigate to workouts tab
  await element(by.id('workouts-tab')).tap();

  // Create new workout
  await element(by.id('create-workout-button')).tap();
  await element(by.id('workout-name-input')).typeText('Push Day');

  // Add exercise
  await element(by.id('add-exercise-button')).tap();
  await element(by.text('Bench Press')).tap();
  await element(by.id('confirm-button')).tap();

  // Save workout
  await element(by.id('save-workout-button')).tap();

  // Verify workout appears in list
  await expect(element(by.text('Push Day'))).toBeVisible();
});
```

### Example 2: Recording a Set

**Integration Test**
```javascript
test('should save a set to the database', async () => {
  const response = await request(app)
    .put('/api/sets')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      workoutId: 1,
      exerciseSets: [{
        exercise_id: 5,
        reps: 10,
        weight: 225,
        set_number: 1,
        set_type: 'normal'
      }],
      save: true
    })
    .expect(200);

  const sets = await pg.getWorkoutSets(1);
  expect(sets).toHaveLength(1);
  expect(sets[0].weight).toBe(225);
});
```

**E2E Test**
```javascript
test('user can record a set during workout', async () => {
  // Start a workout
  await element(by.text('Push Day')).tap();
  await element(by.id('start-workout-button')).tap();

  // First exercise appears
  await expect(element(by.text('Bench Press'))).toBeVisible();

  // Enter set details
  await element(by.id('weight-input-0')).typeText('225');
  await element(by.id('reps-input-0')).typeText('10');

  // Mark set as complete
  await element(by.id('complete-set-button-0')).tap();

  // Verify UI updates (set shows as completed)
  await expect(element(by.id('set-completed-checkmark-0'))).toBeVisible();

  // Verify completion screen shows the set
  await element(by.id('finish-workout-button')).tap();
  await expect(element(by.text('225 lbs x 10'))).toBeVisible();
});
```

## When to Use Each Type

### Use Integration Tests When:
✅ Testing API endpoints and their responses
✅ Verifying business logic in controllers
✅ Testing database operations
✅ Checking authentication/authorization middleware
✅ Validating data transformations
✅ Testing error handling on the backend

**Example scenarios for your app:**
- Does the login endpoint return correct tokens?
- Are workout templates saved correctly to the database?
- Does the exercise creation fail with duplicate names?
- Are sets properly associated with exercises in history?

### Use E2E Tests When:
✅ Testing critical user workflows
✅ Verifying UI interactions and navigation
✅ Testing the full system integration (app + backend)
✅ Validating user experience and accessibility
✅ Testing platform-specific features (iOS/Android)
✅ Smoke testing before releases

**Example scenarios for your app:**
- Can a new user sign up and create their first workout?
- Can a user complete a full workout session from start to finish?
- Does the exercise history display correctly after completing a workout?
- Can a user edit an existing workout template?

## Test Pyramid

```
        /\
       /  \        E2E Tests (Few)
      /____\       - Slow, expensive, brittle
     /      \      - Test critical user paths
    /        \     - Run before releases
   /          \
  /____________\   Integration Tests (Some)
 /              \  - Moderate speed/cost
/                \ - Test component interactions
/__________________\ Unit Tests (Many)
                   - Fast, cheap, reliable
                   - Test individual functions
```

**Recommended distribution:**
- 70% Unit Tests (fast, isolated function tests)
- 20% Integration Tests (API endpoint tests)
- 10% E2E Tests (critical user flows)

## Tools for Your Fitness Tracker

### Integration Testing (Backend)
- **Jest** - Test framework (already installed)
- **Supertest** - HTTP request testing (already installed)
- **Nock** - Mock HTTP requests to external APIs
- **Test database** - Separate PostgreSQL instance

### E2E Testing (React Native App)
- **Detox** - React Native E2E testing (recommended)
- **Appium** - Cross-platform mobile testing
- **Maestro** - Simple mobile UI testing
- **Expo's testing tools** - If using Expo

## Example E2E Test Setup with Detox

```javascript
// e2e/config.json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/jest.config.js",
  "apps": {
    "ios.release": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/FitnessTracker.app"
    },
    "android.release": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/release/app-release.apk"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": { "type": "iPhone 15 Pro" }
    },
    "emulator": {
      "type": "android.emulator",
      "device": { "avdName": "Pixel_7_API_33" }
    }
  }
}
```

```javascript
// e2e/firstTest.e2e.js
describe('Complete Workout Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should allow user to complete a full workout', async () => {
    // Login
    await element(by.id('LoginScreen')).tap();
    await element(by.id('emailInput')).typeText('test@test.com');
    await element(by.id('passwordInput')).typeText('Test123!');
    await element(by.id('loginButton')).tap();

    // Navigate to workouts
    await expect(element(by.id('WorkoutsTab'))).toBeVisible();
    await element(by.id('WorkoutsTab')).tap();

    // Start a workout
    await element(by.text('Push Day')).tap();
    await element(by.id('startWorkoutButton')).tap();

    // Complete first set
    await element(by.id('weightInput-0')).typeText('135');
    await element(by.id('repsInput-0')).typeText('10');
    await element(by.id('completeSetButton-0')).tap();

    // Finish workout
    await element(by.id('finishWorkoutButton')).tap();

    // Verify completion screen
    await expect(element(by.text('Workout Complete!'))).toBeVisible();

    // Check history
    await element(by.id('HistoryTab')).tap();
    await expect(element(by.text('Push Day'))).toBeVisible();
  });
});
```

## Summary

**Integration Tests:**
- Test backend API endpoints
- Verify server-side logic
- Fast and reliable
- Run on every commit
- Mock external services
- Test database interactions

**E2E Tests:**
- Test complete user workflows
- Verify UI and navigation
- Slower and more brittle
- Run before releases
- Test on real devices/simulators
- Validate entire system

**For your fitness tracker, you should:**
1. Write **integration tests** for all your API endpoints (auth, exercises, workouts, sets, history)
2. Write **E2E tests** for critical flows (signup → login → create workout → complete workout → view history)
3. Run integration tests on every commit
4. Run E2E tests before deploying to production or on major releases