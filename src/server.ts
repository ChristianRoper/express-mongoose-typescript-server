import dotenv from 'dotenv'
import express from "express"
import connectDB from './db';
import { auth, profile, users } from "./routes/api"
import cors from 'cors'

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL
}

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('API Running'))

// Define Routes
app.use('/api/auth', auth)
app.use('/api/profile', profile)
app.use('/api/users', users)

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () =>
  // tslint:disable-next-line:no-console
  console.log(`Server is running on port ${PORT}`))
