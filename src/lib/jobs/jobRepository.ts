import Database from "better-sqlite3";

export type JobSummary = {
  id: number;
  processedAt: string;
  url: string;
  sourceFile: string | null;
  title: string | null;
  company: string | null;
  location: string | null;
  finalScore: number;
  verdict: string | null;
  salaryEstimateCzk: number | null;
  isShortlisted: boolean;
  status: string | null;
  privateNote: string | null;
};

export type JobDetail = JobSummary & {
  markdownReport: string | null;
};

function getDb() {
  const dbPath = process.env.JOBS_DB_PATH;

  if (!dbPath) {
    throw new Error("Missing JOBS_DB_PATH in .env.local");
  }

  return new Database(dbPath, {
    readonly: true,
    fileMustExist: true,
  });
}

function getWritableDb() {
  const dbPath = process.env.JOBS_DB_PATH;

  if (!dbPath) {
    throw new Error("Missing JOBS_DB_PATH in .env.local");
  }

  return new Database(dbPath, {
    readonly: false,
    fileMustExist: true,
  });
}

function mapJobSummary(row: any): JobSummary {
  return {
    id: row.id,
    processedAt: row.processed_at,
    url: row.url,
    sourceFile: row.source_file,
    title: row.title,
    company: row.company,
    location: row.location,
    finalScore: row.final_score,
    verdict: row.verdict,
    salaryEstimateCzk: row.salary_estimate_czk,
    isShortlisted: Boolean(row.is_shortlisted),
    status: row.status,
    privateNote: row.private_note,
  };
}

export function getJobSummaries(): JobSummary[] {
  const db = getDb();

  const rows = db
    .prepare(
      `
      SELECT
        id,
        processed_at,
        url,
        source_file,
        title,
        company,
        location,
        final_score,
        verdict,
        salary_estimate_czk,
        is_shortlisted,
        status,
        private_note
      FROM job_evaluations
      WHERE final_score > 10 AND status is not 'delete'--in ('new','prepared','repeated')
      ORDER BY
      CASE
          WHEN status = 'prepared' THEN 1
          WHEN status = 'repeated' THEN 2
          WHEN status = 'considered' THEN 4
          WHEN status = 'applied' THEN 5
          WHEN status = 'rejected' THEN 6
          WHEN status = 'skipped'  THEN 7
          ELSE 3
      END,
      final_score DESC, id DESC;
      `
    )
    .all();

  db.close();

  return rows.map(mapJobSummary);
}

export function getJobDetail(id: number): JobDetail | null {
  const db = getDb();

  const row = db
    .prepare(
      `
      SELECT
        id,
        processed_at,
        url,
        source_file,
        title,
        company,
        location,
        final_score,
        verdict,
        salary_estimate_czk,
        is_shortlisted,
        status,
        private_note,
        markdown_report
      FROM job_evaluations
      WHERE id = ?
      LIMIT 1
      `
    )
    .get(id);

  db.close();

  if (!row) {
    return null;
  }

  return {
    ...mapJobSummary(row),
    markdownReport: row.markdown_report,
  };
}

export function updateJobStatuses(ids: number[], status: string) {
  if (ids.length === 0) {
    return 0;
  }

  const db = getWritableDb();

  try {
    const placeholders = ids.map(() => "?").join(",");

    const statement = db.prepare(`
      UPDATE job_evaluations
      SET status = ?
      WHERE id IN (${placeholders})
    `);

    const result = statement.run(status, ...ids);

    return result.changes;
  } finally {
    db.close();
  }
}