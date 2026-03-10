/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const sequelize = require("../src/config/db");
const env = require("../src/config/env");

function qIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

function tableRegclass(table) {
  // public."table"
  return `public.${qIdent(table)}`;
}

function mdEscape(s) {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

async function getTables() {
  const [rows] = await sequelize.query(
    `
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
    `
  );
  return rows.map((r) => r.tablename);
}

async function getColumns(table) {
  const [rows] = await sequelize.query(
    `
    SELECT
      a.attnum AS ordinal,
      a.attname AS name,
      pg_catalog.format_type(a.atttypid, a.atttypmod) AS type,
      a.attnotnull AS not_null,
      pg_get_expr(ad.adbin, ad.adrelid) AS default,
      col_description(a.attrelid, a.attnum) AS comment
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    LEFT JOIN pg_attrdef ad ON a.attrelid = ad.adrelid AND a.attnum = ad.adnum
    WHERE n.nspname = 'public'
      AND c.relname = :table
      AND a.attnum > 0
      AND NOT a.attisdropped
    ORDER BY a.attnum;
    `,
    { replacements: { table } }
  );

  return rows;
}

async function getConstraints(table) {
  const reg = tableRegclass(table);
  const [rows] = await sequelize.query(
    `
    SELECT
      conname AS name,
      contype AS type,
      pg_get_constraintdef(oid, true) AS definition
    FROM pg_constraint
    WHERE conrelid = :reg::regclass
    ORDER BY contype, conname;
    `,
    { replacements: { reg } }
  );
  return rows;
}

async function getIndexes(table) {
  const [rows] = await sequelize.query(
    `
    SELECT indexname AS name, indexdef AS definition
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = :table
    ORDER BY indexname;
    `,
    { replacements: { table } }
  );
  return rows;
}

async function getExecutedMigrations() {
  try {
    const [rows] = await sequelize.query(`SELECT name FROM "SequelizeMeta" ORDER BY name;`);
    return rows.map((r) => r.name);
  } catch {
    return null;
  }
}

async function main() {
  const now = new Date();
  const stamp = now.toISOString();

  await sequelize.authenticate();

  const tables = await getTables();
  const migrations = await getExecutedMigrations();

  const userTables = tables.filter((t) => t !== "SequelizeMeta");

  let md = "";
  md += `# AgriOne — Database schema snapshot\n\n`;
  md += `Generated at: **${stamp}**\n\n`;
  md += `- Database: ${mdEscape(env.DB_NAME)}\n`;
  md += `- Schema: public\n`;
  md += `- Tables: ${userTables.length}${tables.includes("SequelizeMeta") ? " (+ SequelizeMeta)" : ""}\n\n`;

  if (Array.isArray(migrations)) {
    md += `## Migrations (executed)\n\n`;
    md += `The following migration files are recorded in \`SequelizeMeta\`:\n\n`;
    md += migrations.map((m) => `- ${mdEscape(m)}`).join("\n") + "\n\n";
  }

  md += `## Tables\n\n`;

  for (const table of userTables) {
    const columns = await getColumns(table);
    const constraints = await getConstraints(table);
    const indexes = await getIndexes(table);

    md += `### ${table}\n\n`;

    md += `**Columns**\n\n`;
    md += `| # | Column | Type | Null | Default | Comment |\n`;
    md += `|---:|---|---|---|---|---|\n`;
    for (const c of columns) {
      md += `| ${c.ordinal} | ${mdEscape(c.name)} | ${mdEscape(c.type)} | ${c.not_null ? "NO" : "YES"} | ${mdEscape(c.default || "")} | ${mdEscape(c.comment || "")} |\n`;
    }
    md += `\n`;

    if (constraints.length) {
      md += `**Constraints**\n\n`;
      md += `| Name | Type | Definition |\n`;
      md += `|---|---|---|\n`;
      for (const k of constraints) {
        const typeLabel =
          k.type === "p" ? "PK" :
          k.type === "f" ? "FK" :
          k.type === "u" ? "UNIQUE" :
          k.type === "c" ? "CHECK" :
          k.type;
        md += `| ${mdEscape(k.name)} | ${mdEscape(typeLabel)} | ${mdEscape(k.definition)} |\n`;
      }
      md += `\n`;
    }

    if (indexes.length) {
      md += `**Indexes**\n\n`;
      md += `| Name | Definition |\n`;
      md += `|---|---|\n`;
      for (const ix of indexes) {
        md += `| ${mdEscape(ix.name)} | ${mdEscape(ix.definition)} |\n`;
      }
      md += `\n`;
    }
  }

  const outPath = path.resolve(__dirname, "..", "DATABASE_SCHEMA.md");
  fs.writeFileSync(outPath, md, "utf8");

  console.log(`✅ Wrote schema snapshot to: ${outPath}`);

  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Failed to dump schema:", e);
  try {
    await sequelize.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
