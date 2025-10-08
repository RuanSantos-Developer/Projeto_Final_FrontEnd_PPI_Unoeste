import express from 'express';
import session from 'express-session';

const app = express();
const PORT = 4000;
const HOST = '0.0.0.0';

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'segredo_super_secreto',
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge: 600000 // 1 hora
  }
}));

app.use(express.static('public'));


app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
