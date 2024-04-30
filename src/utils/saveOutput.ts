import fs from 'fs';
import { google } from 'googleapis';
import { parse } from 'json2csv';
import path from 'path';
import { ScrappedData } from '../controllers/parse.controller';
interface SaveOutput {
  email: string;
  attempId: string;
  data: ScrappedData[];
}
export const saveOutput = async ({ email, attempId, data }: SaveOutput) => {
  const fields = ['title', 'img', 'role', 'socialLinks'];

  const modifiedData = data.map((entry) => ({
    ...entry,
    socialLinks: entry.socialLinks.join(', '),
  }));
  try {
    // FOLDER CREATION
    const folderPath = `./results/${email}/${attempId}`;
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) throw err;
      // JSON CREATION
      fs.writeFile(path.join(folderPath, `/${attempId}.json`), JSON.stringify(data), (err) => {
        if (err) throw err;
      });

      // CSV CREATION
      const csv = parse(modifiedData, { fields });
      fs.writeFile(path.join(folderPath, `/${attempId}.csv`), csv, (err) => {
        if (err) throw err;
      });
    });

    // CREATE CONNECTION
    const googleAuth = new google.auth.JWT({
      email: process.env.CLIENT_EMAIL,
      key: process.env.PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
    });
    console.log('auth');
    const sheetInstance = google.sheets({ version: 'v4', auth: googleAuth });
    const drive = google.drive({ version: 'v3', auth: googleAuth });

    // CREATE EMPTY SPREADSHEET
    const spreadsheet = await sheetInstance.spreadsheets.create({
      requestBody: { properties: { title: attempId } },
    });

    if (spreadsheet.data.spreadsheetId) {
      // FILL SPREADSHEET
      const values = modifiedData.map((entry) => [entry.title, entry.img, entry.role, entry.socialLinks]);
      await sheetInstance.spreadsheets.values.update({
        spreadsheetId: spreadsheet.data.spreadsheetId!,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      // ADD READ PERMISSION TO CREATED FILE
      await drive.permissions.create({
        auth: googleAuth,
        fileId: spreadsheet.data.spreadsheetId!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      return spreadsheet.data.spreadsheetUrl;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
