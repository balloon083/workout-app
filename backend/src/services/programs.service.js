const { pool, withTransaction } = require('../config/db');
const groupBy = require('../utils/groupBy');

/** Saves a named program and its ordered list of exercise names. */
function createProgram(userId, name, exerciseNames) {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      'INSERT INTO programs (user_id, name) VALUES ($1, $2) RETURNING id, name, created_at',
      [userId, name]
    );
    const program = rows[0];

    const exercises = [];
    for (const [index, exerciseName] of exerciseNames.entries()) {
      const exResult = await client.query(
        `INSERT INTO program_exercises (program_id, exercise_name, exercise_order)
         VALUES ($1, $2, $3) RETURNING *`,
        [program.id, exerciseName, index + 1]
      );
      exercises.push(exResult.rows[0]);
    }

    return { ...program, exercises };
  });
}

async function listPrograms(userId) {
  const { rows: programs } = await pool.query(
    'SELECT * FROM programs WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  if (programs.length === 0) return [];

  const { rows: exercises } = await pool.query(
    'SELECT * FROM program_exercises WHERE program_id = ANY($1::int[]) ORDER BY exercise_order',
    [programs.map((p) => p.id)]
  );
  const exercisesByProgram = groupBy(exercises, 'program_id');

  return programs.map((p) => ({ ...p, exercises: exercisesByProgram[p.id] || [] }));
}

/** Returns true if a program was deleted, false if none matched. */
async function deleteProgram(userId, programId) {
  const { rowCount } = await pool.query(
    'DELETE FROM programs WHERE id = $1 AND user_id = $2',
    [programId, userId]
  );
  return rowCount > 0;
}

module.exports = { createProgram, listPrograms, deleteProgram };
