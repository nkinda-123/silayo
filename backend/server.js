process.setMaxListeners(20);
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let profileData = {
  name: 'Lisa Oblay Silayo',
  title: 'Student',
  email: 'Lisasilayo12@gmail.com',
  phone: '0759735049',
  bio: 'A passionate and hardworking student with a love for creativity, technology and fashion.',
  skills: ['Teamwork', 'Tailoring', 'Computer Skills', 'Cooking'],
  projects: [
    { id: 1, tag: 'Fashion Design', title: 'Traditional Dress Collection', description: 'Designed and tailored a collection of 5 traditional outfits showcasing local culture and modern style.' },
    { id: 2, tag: 'Technology', title: 'Student Portfolio Website', description: 'Built and deployed a personal portfolio website using HTML, CSS, JavaScript, hosted on Vercel.' },
    { id: 3, tag: 'Community', title: 'School Cooking Event', description: 'Organized and led a school cooking event for 50+ students, managing teamwork and food preparation.' }
  ]
};

app.get('/', (req, res) => res.redirect('/admin.html'));
app.get('/api/profile', (req, res) => res.json(profileData));

app.put('/api/profile', (req, res) => {
  const { name, title, email, phone, bio } = req.body;
  if (name) profileData.name = name;
  if (title) profileData.title = title;
  if (email) profileData.email = email;
  if (phone) profileData.phone = phone;
  if (bio) profileData.bio = bio;
  res.json({ success: true, data: profileData });
});

app.post('/api/skills', (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ error: 'Skill is required' });
  profileData.skills.push(skill);
  res.json({ success: true, skills: profileData.skills });
});

app.delete('/api/skills/:skill', (req, res) => {
  const skill = decodeURIComponent(req.params.skill);
  profileData.skills = profileData.skills.filter(s => s !== skill);
  res.json({ success: true, skills: profileData.skills });
});

app.post('/api/projects', (req, res) => {
  const { tag, title, description } = req.body;
  if (!tag || !title || !description) return res.status(400).json({ error: 'All fields required' });
  const newProject = { id: Date.now(), tag, title, description };
  profileData.projects.push(newProject);
  res.json({ success: true, projects: profileData.projects });
});

app.delete('/api/projects/:id', (req, res) => {
  profileData.projects = profileData.projects.filter(p => p.id != req.params.id);
  res.json({ success: true, projects: profileData.projects });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
