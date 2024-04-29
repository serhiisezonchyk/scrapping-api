import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';
import router from './routes';

const app: Application = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
