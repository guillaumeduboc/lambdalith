import express from 'express';
import morgan from 'morgan';

import { router } from './router';

const app = express();
app.use(morgan('dev'));
app.use('/express', router);

export { app };
