#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const CALENDAR_PATH = process.argv[2] || path.join(process.cwd(), 'marketing', 'content-calendar.csv');

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error: cannot read file: ${filePath}`);
    process.exitCode = 2;
    return '';
  }
}

function parseCsvLoose(csvString) {
  // Very simple CSV parser: splits on commas; does not handle quoted commas
  const lines = csvString.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] ?? '').trim();
    });
    return row;
  });
  return { headers, rows };
}

function fileExists(p) {
  if (!p) return false;
  try {
    return fs.existsSync(path.isAbsolute(p) ? p : path.join(process.cwd(), p));
  } catch {
    return false;
  }
}

const REQUIRED_HEADERS = [
  'date',
  'platform',
  'type',
  'status',
  'owner',
  'campaign',
  'title',
  'copy_path',
  'asset_path',
  'cta_url',
  'utm_campaign',
  'notes',
];

const VALID_STATUS = new Set(['idea', 'draft', 'ready', 'scheduled', 'posted']);
const VALID_PLATFORMS = new Set(['x', 'linkedin']);

function validateCalendar(calendarPath) {
  const csv = readText(calendarPath);
  const { headers, rows } = parseCsvLoose(csv);

  const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  const errors = [];

  if (missingHeaders.length) {
    errors.push(`Missing headers: ${missingHeaders.join(', ')}`);
  }

  let okCount = 0;
  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // account for header line
    const rowErrors = [];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
      rowErrors.push('invalid date (YYYY-MM-DD)');
    }
    if (!VALID_PLATFORMS.has(row.platform)) {
      rowErrors.push(`invalid platform: ${row.platform}`);
    }
    if (!VALID_STATUS.has(row.status)) {
      rowErrors.push(`invalid status: ${row.status}`);
    }
    if (!row.title) {
      rowErrors.push('missing title');
    }
    if (!row.copy_path || !fileExists(row.copy_path)) {
      rowErrors.push(`missing copy file: ${row.copy_path}`);
    }
    if (row.asset_path && !fileExists(row.asset_path)) {
      rowErrors.push(`asset not found: ${row.asset_path}`);
    }
    if (row.cta_url && !/^https?:\/\//.test(row.cta_url)) {
      rowErrors.push('cta_url should be http(s)');
    }

    if (rowErrors.length) {
      errors.push(`Row ${rowNum}: ${rowErrors.join('; ')}`);
    } else {
      okCount += 1;
    }
  });

  return { errors, okCount, total: rows.length };
}

const { errors, okCount, total } = validateCalendar(CALENDAR_PATH);

if (errors.length) {
  console.error('Validation errors:');
  for (const e of errors) console.error(' - ' + e);
  console.error(`\nValid: ${okCount}/${total}`);
  process.exitCode = 1;
} else {
  console.log(`Calendar OK: ${okCount}/${total} rows valid`);
}

