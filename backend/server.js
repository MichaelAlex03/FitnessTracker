require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const jwt = require('jsonwebtoken');
const { logger } = require('./middleware/logEvents');
const path = require('path');
const pool = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3000;

const app = express();


//logs requests made to server
app.use(logger);

app.use(credentials)

//handle form data
app.use(express.urlencoded({extended : true}));

//handle json request
app.use(express.json());

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//server front end through backend will build frontend and place here in backend
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

//put auth routes here before verifyJWT
app.use('/auth/register', require('./routes/auth/register'));
app.use('/auth/login', require('./routes/auth/login'));
// app.use('/auth/refresh', require('./routes/auth/refresh'));
// app.use('/auth/logout', require('./routes/auth/logout'));

app.use(verifyJWT);

//put all api routes after verifyJWT
app.use('/api/exercises', require('./routes/api/exercises'));
app.use('/api/workouts', require('./routes/api/workouts'));
app.use('/api/sets', require('./routes/api/sets'));




app.get("/exercise_history/:id/:exercise_name", verifyJWT, async(req, res) => {
  const userId = req.userId

  const exercise_name = req.params.exercise_name;

  try{
    const result = await pool.query('SELECT * FROM workout_sets WHERE exercise_name = $1 AND user_id = $2', [exercise_name, userId]);
    res.json({result: result.rows, success: true});
  }catch (error) {
    console.error('Error getting exercise history:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
})

app.post("/create_sets", verifyJWT, async (req, res) => {
  
  const userId = req.userId

  try{
      const result = await pool.query('INSERT INTO workout_sets (exercise_id, exercise_reps, exercise_weight, workout_id, exercise_name, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
        [req.body.exercise_id, req.body.reps, req.body.weight, req.body.workout_id, req.body.exercise_name, userId]);

        console.log('New set created:', result.rows[0]); 
        res.status(201).json({ success: true, newSet: result.rows[0] });
  } catch(error){
    console.error('Error inserting set', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
})





app.patch("/user_sets", verifyJWT, async (req, res) => {

  const {sets } = req.body;
  try{
    const updatePromises = sets.map(set => {
      const { exercise_reps, exercise_weight, id } = set;
      console.log(id);
      return pool.query(
        'UPDATE workout_sets SET exercise_reps = $1, exercise_weight = $2 WHERE id = $3',
        [exercise_reps, exercise_weight, id]
      );
    });

    await Promise.all(updatePromises);
    res.send({success: true});
  }catch(error){
    console.error('Error posting data:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
})


app.delete('/set/:id', async (req, res) => {
  const setId = req.params.id
  try {
    await pool.query('DELETE FROM workout_sets WHERE id = $1', [setId]);
    res.status(200).send({success: true, message: 'set deleted'});
  } catch (error) {
    console.error('Error deleting set:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
})

app.delete('/user_exercises/:id', async (req, res) => {
  const exerciseId = req.params.id;
  try{
    await pool.query('DELETE FROM user_exercises WHERE id = $1' , [exerciseId]);
    res.status(200).send({success: true, message: 'exercises deleted'});
  }catch(error){
    console.error('Error inserting user:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
})



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  