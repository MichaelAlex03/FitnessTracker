# Integration Tests for Fitness Tracker Backend

Integration tests verify that multiple components work together correctly, testing the full flow from HTTP request through controllers, database operations, and back to the response.

## Setup

### Dependencies
You already have `supertest` and `jest` installed. You may also want:
```bash
npm install --save-dev @jest/globals
```

### Test Database Configuration
Create a separate test database to avoid affecting your production data:

```javascript
// backend/config/testDb.js
const { Pool } = require('pg');

const testPool = new Pool({
  host: process.env.TEST_DB_HOST || 'localhost',
  port: process.env.TEST_DB_PORT || 5432,
  database: process.env.TEST_DB_NAME || 'fitness_tracker_test',
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
});

module.exports = testPool;
```

## Example Integration Tests

### 1. Authentication Flow Integration Test

```javascript
// backend/__tests__/integration/auth.test.js
const request = require('supertest');
const app = require('../../server'); // Your Express app
const pg = require('../../model/sql');

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    // Setup: Create test database tables
    await pg.query('DELETE FROM users WHERE user_email LIKE \'%@test.com\'');
  });

  afterAll(async () => {
    // Cleanup: Remove test data
    await pg.query('DELETE FROM users WHERE user_email LIKE \'%@test.com\'');
    await pg.pool.end(); // Close database connection
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user and send verification email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@test.com',
          username: 'testuser',
          password: 'Test123!@#'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('verification');

      // Verify user was created in database
      const users = await pg.findUser('newuser@test.com');
      expect(users).toHaveLength(1);
      expect(users[0].user_name).toBe('testuser');
    });

    test('should reject duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@test.com',
          username: 'user1',
          password: 'Test123!@#'
        });

      // Attempt duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@test.com',
          username: 'user2',
          password: 'Test123!@#'
        })
        .expect(409);

      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a verified test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'logintest@test.com',
          username: 'loginuser',
          password: 'Test123!@#'
        });

      // Manually verify the user (or mock verification)
      await pg.query(
        'UPDATE users SET verified = true WHERE user_email = $1',
        ['logintest@test.com']
      );
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@test.com',
          pwd: 'Test123!@#'
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('id');
      expect(response.body.user).toBe('loginuser');
    });

    test('should reject invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@test.com',
          pwd: 'WrongPassword123'
        })
        .expect(401);
    });

    test('should reject non-existent user', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          pwd: 'Test123!@#'
        })
        .expect(401);
    });
  });
});
```

### 2. Exercises CRUD Integration Test

```javascript
// backend/__tests__/integration/exercises.test.js
const request = require('supertest');
const app = require('../../server');
const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

describe('Exercises Integration Tests', () => {
  let authToken;
  let userId;
  let exerciseId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const user = await pg.query(
      `INSERT INTO users (user_email, user_name, user_pass, verified)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['exercises@test.com', 'exerciseuser', 'hashedpass', true]
    );
    userId = user.rows[0].id;

    authToken = jwt.sign(
      { id: userId, email: 'exercises@test.com', username: 'exerciseuser' },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    // Cleanup
    await pg.query('DELETE FROM exercises WHERE user_id = $1', [userId]);
    await pg.query('DELETE FROM users WHERE id = $1', [userId]);
    await pg.pool.end();
  });

  describe('POST /api/exercises', () => {
    test('should create a new exercise with valid auth', async () => {
      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          exerciseName: 'Bench Press',
          muscleGroup: 'Chest'
        })
        .expect(201);

      expect(response.body).toHaveProperty('result');
      exerciseId = response.body.result.id;

      // Verify in database
      const exercises = await pg.query(
        'SELECT * FROM exercises WHERE id = $1',
        [exerciseId]
      );
      expect(exercises.rows[0].exercise_name).toBe('Bench Press');
    });

    test('should reject request without auth token', async () => {
      await request(app)
        .post('/api/exercises')
        .send({
          userId: userId,
          exerciseName: 'Squat',
          muscleGroup: 'Legs'
        })
        .expect(401);
    });
  });

  describe('GET /api/exercises/:userId', () => {
    test('should retrieve all exercises for a user', async () => {
      // Create multiple exercises
      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          exerciseName: 'Deadlift',
          muscleGroup: 'Back'
        });

      const response = await request(app)
        .get(`/api/exercises/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.exercises)).toBe(true);
      expect(response.body.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('DELETE /api/exercises/:exerciseId', () => {
    test('should delete an exercise', async () => {
      const response = await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toContain('deleted');

      // Verify deletion
      const exercises = await pg.query(
        'SELECT * FROM exercises WHERE id = $1',
        [exerciseId]
      );
      expect(exercises.rows.length).toBe(0);
    });
  });
});
```

### 3. Workout Flow Integration Test

```javascript
// backend/__tests__/integration/workout-flow.test.js
const request = require('supertest');
const app = require('../../server');
const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

describe('Complete Workout Flow Integration Test', () => {
  let authToken;
  let userId;
  let exerciseId;
  let workoutId;

  beforeAll(async () => {
    // Setup user
    const user = await pg.query(
      `INSERT INTO users (user_email, user_name, user_pass, verified)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['workout@test.com', 'workoutuser', 'hashedpass', true]
    );
    userId = user.rows[0].id;

    authToken = jwt.sign(
      { id: userId, email: 'workout@test.com', username: 'workoutuser' },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    await pg.query('DELETE FROM users WHERE id = $1', [userId]);
    await pg.pool.end();
  });

  test('Complete workout flow: create exercise, create workout, add sets, finish workout', async () => {
    // Step 1: Create an exercise
    const exerciseResponse = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: userId,
        exerciseName: 'Barbell Squat',
        muscleGroup: 'Legs'
      })
      .expect(201);

    exerciseId = exerciseResponse.body.result.id;

    // Step 2: Create a workout template
    const workoutResponse = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: userId,
        workoutName: 'Leg Day',
        exercises: [
          {
            exerciseId: exerciseId,
            exerciseName: 'Barbell Squat'
          }
        ]
      })
      .expect(201);

    workoutId = workoutResponse.body.workoutId;

    // Step 3: Add sets to the workout
    const setsResponse = await request(app)
      .put('/api/sets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        workoutId: workoutId,
        userId: userId,
        workoutName: 'Leg Day',
        exercises: [
          {
            id: exerciseId,
            exercise_name: 'Barbell Squat'
          }
        ],
        exerciseSets: [
          {
            exercise_id: exerciseId,
            reps: 10,
            weight: 225,
            set_number: 1,
            set_type: 'normal'
          },
          {
            exercise_id: exerciseId,
            reps: 8,
            weight: 245,
            set_number: 2,
            set_type: 'normal'
          }
        ],
        save: false, // Mark as completed
        elapsedTime: 1800 // 30 minutes
      })
      .expect(200);

    expect(setsResponse.body.message).toContain('success');

    // Step 4: Verify workout appears in history
    const historyResponse = await request(app)
      .get(`/api/history/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(historyResponse.body.workouts).toBeDefined();
    const legDayWorkout = historyResponse.body.workouts.find(
      w => w.workout_name === 'Leg Day'
    );
    expect(legDayWorkout).toBeDefined();
    expect(legDayWorkout.elapsed_time).toBe(1800);
  });
});
```

### 4. Protected Routes Integration Test

```javascript
// backend/__tests__/integration/protected-routes.test.js
const request = require('supertest');
const app = require('../../server');
const jwt = require('jsonwebtoken');

describe('Protected Routes Integration Tests', () => {
  const validToken = jwt.sign(
    { id: 1, email: 'test@test.com', username: 'testuser' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const expiredToken = jwt.sign(
    { id: 1, email: 'test@test.com', username: 'testuser' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '0s' }
  );

  describe('Authentication middleware on protected routes', () => {
    test('should reject request without token', async () => {
      await request(app)
        .get('/api/exercises/1')
        .expect(401);
    });

    test('should reject request with invalid token', async () => {
      await request(app)
        .get('/api/exercises/1')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });

    test('should reject request with expired token', async () => {
      await request(app)
        .get('/api/exercises/1')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);
    });

    test('should accept request with valid token', async () => {
      const response = await request(app)
        .get('/api/exercises/1')
        .set('Authorization', `Bearer ${validToken}`);

      // Should not be 401 or 403 (might be 200, 404, etc.)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
```

## Running Integration Tests

### Separate Integration from Unit Tests

```javascript
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=__tests__/unit",
    "test:integration": "jest --testPathPattern=__tests__/integration --runInBand",
    "test:coverage": "jest --coverage"
  }
}
```

### Jest Configuration for Integration Tests

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  // Run integration tests sequentially to avoid DB conflicts
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Increase timeout for integration tests
  testTimeout: 10000
};
```

### Setup File

```javascript
// jest.setup.js
// Set environment to test
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
```

## Key Differences: Integration vs Unit Tests

| Aspect | Unit Tests | Integration Tests |
|--------|-----------|-------------------|
| **Scope** | Single function/module | Multiple components |
| **Dependencies** | Mocked | Real (or test versions) |
| **Database** | Mocked | Test database |
| **Speed** | Fast (milliseconds) | Slower (seconds) |
| **Purpose** | Verify logic | Verify flow |
| **Isolation** | Complete | Partial |

## Best Practices

1. **Use a separate test database** - Never test against production
2. **Clean up after tests** - Use `beforeAll`, `afterAll`, `beforeEach`, `afterEach`
3. **Run sequentially** - Use `--runInBand` to avoid race conditions
4. **Test real flows** - Simulate actual user journeys
5. **Use transactions** - Rollback after each test for speed
6. **Mock external services** - Email, payment APIs, S3 uploads
7. **Test error cases** - Network failures, timeouts, invalid data
8. **Keep tests independent** - Each test should work in isolation

## Example Test Structure

```
backend/
├── __tests__/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── exercises.test.js
│   │   ├── workouts.test.js
│   │   ├── workout-flow.test.js
│   │   └── protected-routes.test.js
│   └── unit/
│       ├── controllers/
│       ├── middleware/
│       └── utils/
├── jest.config.js
└── jest.setup.js
```