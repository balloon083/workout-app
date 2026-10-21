const programsService = require('../services/programs.service');
const HttpError = require('../utils/HttpError');
const { parseId } = require('../utils/validation');

// Body: { name, exercises: ["Squat", "Bench Press", ...] }
async function create(req, res) {
  const { name, exercises } = req.body ?? {};

  if (typeof name !== 'string' || !name.trim()) {
    throw HttpError.badRequest('Program name is required');
  }
  if (!Array.isArray(exercises) || exercises.length === 0) {
    throw HttpError.badRequest('At least one exercise is required');
  }

  const program = await programsService.createProgram(req.userId, name.trim(), exercises);
  res.status(201).json(program);
}

async function list(req, res) {
  res.json(await programsService.listPrograms(req.userId));
}

async function remove(req, res) {
  const deleted = await programsService.deleteProgram(req.userId, parseId(req.params.id));
  if (!deleted) throw HttpError.notFound('Program not found');
  res.json({ deleted: true });
}

module.exports = { create, list, remove };
