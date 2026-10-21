const { pool, withTransaction } = require('../config/db');
const groupBy = require('../utils/groupBy');

async function insertExercise(client, workoutId, exercise) {
  const { rows } = await client.query(
    'INSERT INTO exercises (workout_id, exercise_name) VALUES ($1, $2) RETURNING id, exercise_name',
    [workoutId, exercise.exercise_name]
  );
  const exerciseRow = rows[0];

  const sets = Array.isArray(exercise.sets) ? exercise.sets : [];
  const insertedSets = [];
  for (const [index, set] of sets.entries()) {
    const setResult = await client.query(
      `INSERT INTO sets (exercise_id, set_order, weight, reps, completed)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [exerciseRow.id, index + 1, set.weight ?? null, set.reps ?? null, set.completed ?? false]
    );
    insertedSets.push(setResult.rows[0]);
  }

  return { ...exerciseRow, sets: insertedSets };
}

/** Saves a workout with all of its exercises and sets in one transaction. */
function createWorkout(userId, { workout_date, notes, duration_seconds, exercises }) {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO workouts (user_id, workout_date, notes, duration_seconds)
       VALUES ($1, $2, $3, $4)
       RETURNING id, workout_date, notes, duration_seconds, created_at`,
      [userId, workout_date || new Date(), notes || null, duration_seconds || null]
    );
    const workout = rows[0];

    const insertedExercises = [];
    for (const exercise of exercises) {
      insertedExercises.push(await insertExercise(client, workout.id, exercise));
    }

    return { ...workout, exercises: insertedExercises };
  });
}

/**
 * Returns the user's workouts, newest first, with exercises and sets nested.
 * Uses three flat queries instead of one query per workout.
 */
async function listWorkouts(userId) {
  const { rows: workouts } = await pool.query(
    'SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC, id DESC',
    [userId]
  );
  if (workouts.length === 0) return [];

  const { rows: exercises } = await pool.query(
    'SELECT * FROM exercises WHERE workout_id = ANY($1::int[]) ORDER BY id',
    [workouts.map((w) => w.id)]
  );

  let setsByExercise = {};
  if (exercises.length > 0) {
    const { rows: sets } = await pool.query(
      'SELECT * FROM sets WHERE exercise_id = ANY($1::int[]) ORDER BY set_order',
      [exercises.map((e) => e.id)]
    );
    setsByExercise = groupBy(sets, 'exercise_id');
  }

  const exercisesWithSets = exercises.map((ex) => ({ ...ex, sets: setsByExercise[ex.id] || [] }));
  const exercisesByWorkout = groupBy(exercisesWithSets, 'workout_id');

  return workouts.map((w) => ({ ...w, exercises: exercisesByWorkout[w.id] || [] }));
}

/** Returns true if a workout was deleted, false if none matched. */
async function deleteWorkout(userId, workoutId) {
  const { rowCount } = await pool.query(
    'DELETE FROM workouts WHERE id = $1 AND user_id = $2',
    [workoutId, userId]
  );
  return rowCount > 0;
}

module.exports = { createWorkout, listWorkouts, deleteWorkout };
