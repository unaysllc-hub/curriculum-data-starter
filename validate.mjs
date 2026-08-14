import { readFile } from 'node:fs/promises';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node validate.mjs <curriculum.json>');
  process.exit(2);
}

const errors = [];
const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const text = (value) => typeof value === 'string' && value.trim().length > 0;

function requireText(item, key, path) {
  if (!text(item?.[key])) errors.push(`${path}.${key} must be a non-empty string`);
}

function requireArray(item, key, path) {
  if (!Array.isArray(item?.[key]) || item[key].length === 0) {
    errors.push(`${path}.${key} must be a non-empty array`);
    return [];
  }
  return item[key];
}

function validate(data) {
  if (!object(data)) return ['root must be a JSON object'];
  ['title', 'version', 'language'].forEach((key) => requireText(data, key, 'root'));
  requireArray(data, 'grades', 'root').forEach((grade, gi) => {
    const gp = `grades[${gi}]`;
    ['id', 'name'].forEach((key) => requireText(grade, key, gp));
    requireArray(grade, 'subjects', gp).forEach((subject, si) => {
      const sp = `${gp}.subjects[${si}]`;
      ['id', 'name'].forEach((key) => requireText(subject, key, sp));
      requireArray(subject, 'terms', sp).forEach((term, ti) => {
        const tp = `${sp}.terms[${ti}]`;
        ['id', 'name'].forEach((key) => requireText(term, key, tp));
        requireArray(term, 'strands', tp).forEach((strand, sti) => {
          const stp = `${tp}.strands[${sti}]`;
          ['id', 'name'].forEach((key) => requireText(strand, key, stp));
          requireArray(strand, 'units', stp).forEach((unit, ui) => {
            const up = `${stp}.units[${ui}]`;
            ['id', 'title'].forEach((key) => requireText(unit, key, up));
            requireArray(unit, 'objectives', up).forEach((objective, oi) => {
              if (!text(objective)) errors.push(`${up}.objectives[${oi}] must be a non-empty string`);
            });
          });
        });
      });
    });
  });
  return errors;
}

try {
  const data = JSON.parse(await readFile(file, 'utf8'));
  validate(data);
  if (errors.length) {
    console.error(`Invalid curriculum: ${errors.length} problem(s)`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
  console.log(`Valid curriculum: ${file}`);
} catch (error) {
  console.error(`Could not validate ${file}: ${error.message}`);
  process.exit(1);
}
