

import express, { Request, Response } from 'express';
import cors from 'cors';
import { createObjectCsvWriter } from 'csv-writer';
import csvParser from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const PATH = 'all excels/';

//> ------ Karthik Sarode : karthik.sarode23@gmail.com - UI for excel files ------
app.get('/', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

app.get('/applied-jobs', (_req: Request, res: Response): void => {
  /**
   * Retrieves a list of applied jobs from the applications history CSV file.
   * 
   * Returns a JSON response containing a list of jobs, each with details such as 
   * Job ID, Title, Company, HR Name, HR Link, Job Link, External Job link, and Date Applied.
   * 
   * If the CSV file is not found, returns a 404 error with a relevant message.
   * If any other exception occurs, returns a 500 error with the exception message.
   */
  try {
    const jobs: any[] = [];
    const csvPath = path.join(PATH, 'all_applied_applications_history.csv');
    
    if (!fs.existsSync(csvPath)) {
      res.status(404).json({ error: "No applications history found" });
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (row: any) => {
        jobs.push({
          Job_ID: row['Job ID'],
          Title: row['Title'],
          Company: row['Company'],
          HR_Name: row['HR Name'],
          HR_Link: row['HR Link'],
          Job_Link: row['Job Link'],
          External_Job_link: row['External Job link'],
          Date_Applied: row['Date Applied']
        });
      })
      .on('end', () => {
        res.json(jobs);
      })
      .on('error', (error: any) => {
        res.status(500).json({ error: error.message });
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/applied-jobs/:job_id', (req: Request, res: Response): void => {
  /**
   * Updates the 'Date Applied' field of a job in the applications history CSV file.
   */
  try {
    const { job_id } = req.params;
    const csvPath = path.join(PATH, 'all_applied_applications_history.csv');
    
    if (!fs.existsSync(csvPath)) {
      res.status(404).json({ error: `CSV file not found at ${csvPath}` });
      return;
    }

    const rows: any[] = [];
    let found = false;
    let headers: string[] = [];

    // Read current CSV content
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('headers', (headerList: string[]) => {
        headers = headerList;
      })
      .on('data', (row: any) => {
        if (row['Job ID'] === job_id) {
          row['Date Applied'] = new Date().toISOString();
          found = true;
        }
        rows.push(row);
      })
      .on('end', () => {
        if (!found) {
          res.status(404).json({ error: `Job ID ${job_id} not found` });
          return;
        }

        // Write updated CSV
        const writer = createObjectCsvWriter({
          path: csvPath,
          header: headers.map(h => ({ id: h, title: h }))
        });

        writer.writeRecords(rows)
          .then(() => {
            res.json({ message: "Date Applied updated successfully" });
          })
          .catch((error: any) => {
            res.status(500).json({ error: error.message });
          });
      })
      .on('error', (error: any) => {
        res.status(500).json({ error: error.message });
      });
  } catch (error: any) {
    console.error(`Error updating applied date: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
}

export default app;
//<
