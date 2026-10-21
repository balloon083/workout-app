/** Groups rows into `{ [row[key]]: row[] }`, preserving row order. */
function groupBy(rows, key) {
  const groups = {};
  for (const row of rows) {
    (groups[row[key]] ||= []).push(row);
  }
  return groups;
}

module.exports = groupBy;
