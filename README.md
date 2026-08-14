# Curriculum Data Starter

An open JSON structure, sample dataset, browser validator, and Node.js validator for representing curriculum subjects, grades, terms, strands, units, and learning objectives.

## Repository contents

- `schema.json`: JSON Schema for curriculum files
- `sample-curriculum.json`: small example dataset
- `validate.mjs`: dependency-free structural validator for Node.js
- `index.html`: browser-based validator and format inspector

## Validate a file

```bash
node validate.mjs sample-curriculum.json
```

## Scope

The included curriculum is an example of the data format, not an official national curriculum. Schools and publishers should review all content against their own standards.

## Contributing

Contributions can improve the schema, add tests, document mappings, or provide clearly licensed curriculum examples. Do not submit copyrighted curriculum content without permission.

## License

Code is MIT licensed. Example data is provided under CC0-1.0.
