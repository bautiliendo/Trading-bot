import express from 'express';
import cors from 'cors'
import router from './routes/authRoutes.js';


const app = express();
const PORT = 3001;

//middleware
app.use(express.json());
app.use(cors());

app.use('/auth', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
