const express = require('express');
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const Skill = require('./models/skills');
const Project = require('./models/projects');



// Setting up EJS
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// const mongoURI = 'mongodb://tyno:tyno@mongodb:27017';
const mongoURI = 'mongodb://tyno:tyno@localhost:27017';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Add middleware
app.use(cors())
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + '/public'))
// Set up Base route
app.get('/', (req, res) => {
  // Render view and pass a variable to it 
  res.render('index', {
    heading: 'USW DS BACKEND',
    showText: true
  })
});

// Route to render the form
app.get('/skills-form', (req, res) => {
  res.render('new-skills');
});

app.get('/skills', async (req, res) => {
  const skills = await Skill.find();
  
  return res.status(200).json({ skills });
});

// Route to handle form submission
app.post('/skills', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSkill = new Skill({ name, description });
    await newSkill.save();
    res.redirect('/skills-list'); // Redirect to the skills listing page
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error creating skill' });
  }
});

// Route to render the form (project)
app.get('/projects-form', (req, res) => {
  res.render('new-projects');
});

app.get('/projects', async (req, res) => {
  const projects = await Project.find();

  return res.status(200).json({ projects });
});


// Route to handle form submission
app.post('/projects', async (req, res) => {
  try {
    const { name, techStack, description } = req.body;
    const newProject = new Project({ name, techStack, description });
    await newProject.save();
    res.redirect('/projects-list'); // Redirect to the skills listing page
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error creating project' });
  }
});

// Route to render the project list
app.get('/projects-list', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('projects-list', { projects });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error fetching projects' });
  }
});

// Route to render the skill list
app.get('/skills-list', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.render('skills-list', { skills });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error fetching skills' });
  }
});
// Route to handle DELETE request for skills
app.delete('/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Skill.findByIdAndDelete(id);
    res.redirect('/skills-list'); // Redirect to the skills listing page
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error deleting skill' });
  }
});

// Route to render the edit form for a skill
app.get('/skills/:id/edit', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    res.render('edit-skill', { skill });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error fetching skill for editing' });
  }
});


// Route to handle the PUT request for updating a skill
app.put('/skills/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const skillId = req.params.id;
    
    // Find the skill by ID and update its properties
    await Skill.findByIdAndUpdate(skillId, { name, description });
    
    res.redirect('/skills-list');
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error updating skill' });
  }
});

// Route to handle DELETE request for projects
app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.redirect('/projects-list'); // Redirect to the projects listing page
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error deleting project' });
  }
});

// Route to render the edit form for a project
app.get('/projects/:id/edit', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render('edit-project', { project });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error fetching project for editing' });
  }
});

// Route to handle PUT request for projects
app.put('/projects/:id', async (req, res) => {
  try {
    const { name, techStack, description } = req.body;
    const projectId = req.params.id;
    
    // Find the skill by ID and update its properties
    await Project.findByIdAndUpdate(projectId, { name, techStack, description });
    
    res.redirect('/projects-list');
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error updating project' });
  }
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});