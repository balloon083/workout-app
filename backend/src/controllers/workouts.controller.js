const workoutsService = require('../services/workouts.service');
const HttpError = require('../utils/HttpError');
const { parseId } = require('../utils/validation');

// Body: { notes?, duration_seconds?, workout_date?, exercises: [{ exercise_name, sets: [{ weight, reps, completed }] }] }
async function create(req, res) {
  const body = req.body ?? {};
  if (!Array.isArray(body.exercises)) {
    throw HttpError.badRequest('Exercises must be an array (can be empty)');
  }

  const workout = await workoutsService.createWorkout(req.userId, body);
  res.status(201).json(workout);
}

async function list(req, res) {
  res.json(await workoutsService.listWorkouts(req.userId));
}

async function remove(req, res) {
  const deleted = await workoutsService.deleteWorkout(req.userId, parseId(req.params.id));
  if (!deleted) throw HttpError.notFound('Workout not found');
  res.json({ deleted: true });
}

module.exports = { create, list, remove };
