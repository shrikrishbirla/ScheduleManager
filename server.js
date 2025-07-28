const express = require('express');
const session = require('express-session');
const fs = require('fs').promises;
const path = require('path');



const app = express();
const port = 3000;
const UserFile = path.join(__dirname, 'users.json');
const LectureFile = path.join(__dirname, 'lectures.json');
const LeaveFile = path.join(__dirname, 'leave.json')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: "tgytghnhjndsjhbgtdrsaftgyqdt567819iwhdghcaczyxtr6tyghbknczxuhgyftdrse3ws5etxdfchgvhbgyt76r5e64w5setxfycgh",
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role) {
        return res.status(400).send("All fields are required");
    }

    try {
        const data = await fs.readFile(UserFile, 'utf8');
        const users = JSON.parse(data);

        const exists = users.find(u => u.username === username);
        if (exists) {
            return res.status(400).send("User already exists");
        }

        users.push({ username, password, email, role });
        await fs.writeFile(UserFile, JSON.stringify(users, null, 2));
        
        res.status(200).send("Registered successfully!");
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send("Server error");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const data = await fs.readFile(UserFile, 'utf8');               
        const users = JSON.parse(data);
        
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            req.session.user = {
                username: user.username,
                role: user.role
            };
            res.status(200).json({ message: "Login successful", role: user.role });
        } 
        else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Server error");
    }
});

app.get('/admin', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    res.render('admin');
  } else {
    res.status(403).send("Access denied.");
  }
});

app.get('/teacher', (req, res) => {
  if (req.session.user && req.session.user.role === 'teacher') {
    res.render('teacher');
  } else {
    res.status(403).send("Access denied.");
  }
});

app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(UserFile, 'utf8');
        const users = JSON.parse(data);
        res.json(users);
    } catch (err) {
        console.error("Failed to load users:", err);
        res.status(500).send("Error loading users");
    }
});


app.post('/add-lecture', async (req, res) => {
    try {
        const data = await fs.readFile(LectureFile, 'utf8');
        const lectures = JSON.parse(data);

        lectures.push(req.body);
        await fs.writeFile(LectureFile, JSON.stringify(lectures, null, 2));

        res.status(200).json({ message: "Lecture added!" });
    } catch (err) {
        console.error("Error saving lecture:", err);
        res.status(500).send("Server error");
    }
});

app.get('/lectures', async (req, res) => {
    try {
        const data = await fs.readFile(LectureFile, 'utf8');
        const lectures = JSON.parse(data);
        res.json(lectures);
    } catch (err) {
        console.error("Error reading lectures:", err);
        res.status(500).send("Server error");
    }
});

app.post('/leave-request', async (req, res) => {
    try {
        const data = await fs.readFile(LeaveFile, 'utf8');
        const leave = JSON.parse(data);

        leave.push(req.body);
        await fs.writeFile(LeaveFile, JSON.stringify(leave, null, 2));

        res.status(200).json({ message: "Leave request sent!" });
    } catch (err) {
        console.error("Error on sending leave request:", err);
        res.status(500).send("Server error");
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
