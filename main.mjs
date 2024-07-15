import fs from 'node:fs';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import escapeHTML from 'escape-html';

const app = express();
const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

const template = fs.readFileSync('./template.html', 'utf-8');

async function getChatHtml() {
  const posts = await prisma.post.findMany();
  const html = template.replace(
    '<!-- posts -->',
    posts.map((post) => `<li>${escapeHTML(post.message)}</li>`).join('')
  );
  return html;
}

app.get('/', async (req, res) => {
  const html = await getChatHtml();
  res.send(html);
});

app.post('/send', async (req, res) => {
  const { message } = req.body;
  await prisma.post.create({
    data: { message }
  });
  response.redirect('/');
});

app.listen(3000);
