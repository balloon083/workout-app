const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const workoutRoutes = require('./routes/workouts.routes');
const mealRoutes = require('./routes/meals.routes');
const programRoutes = require('./routes/programs.routes');
const foodRoutes = require('./routes/foods.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Workout app API is running' });
});

app.use('/auth', authRoutes);
app.use('/workouts', workoutRoutes);
app.use('/meals', mealRoutes);
app.use('/programs', programRoutes);
app.use('/foods', foodRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
