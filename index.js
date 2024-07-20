const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render the index page
app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) return res.send('Something went wrong');
        else res.render("index", { files: files });
    });
});

app.get('/all-notes', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) return res.send('Something went wrong');
        else res.render("all-notes", { files: files });
    });
});

app.get('/create-note', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) return res.send('Something went wrong');
        else res.render("create-note", { files: files });
    });
});

// Route to handle file creation
app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.filedata, (err) => {
        if (err) return res.send("Something went wrong");
        else res.redirect('/all-notes');
    });
});

// Route to handle file read
app.get('/read/:filename', (req, res) => {
    const filename = req.params.filename;

    fs.readFile(`./files/${filename}.txt`, 'utf-8', (err, fileContent) => {
        if (err) return res.send('Something went wrong');
        else res.render("read", { filename, fileContent });
    });
});

// Route to handle file edit
app.get('/edit/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}.txt`, "utf-8", function (err, data) {
        if (err) return res.send(err.message);
        else res.render("edit", { data, filename: req.params.filename });
    });
});

// Route to handle file update
app.post('/update/:filename', (req, res) => {
    const originalFilename = req.body.originalFilename;
    const newFilename = req.body.filename;
    const fileData = req.body.filedata;

    const originalFilePath = path.join(__dirname, 'files', `${originalFilename}.txt`);
    const newFilePath = path.join(__dirname, 'files', `${newFilename}.txt`);

    if (originalFilename !== newFilename) {
        fs.rename(originalFilePath, newFilePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error renaming file');
            }

            fs.writeFile(newFilePath, fileData, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error saving file');
                }
                res.redirect('/all-notes');
            });
        });
    } else {
        fs.writeFile(originalFilePath, fileData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving file');
            }
            res.redirect('/all-notes');
        });
    }
});

// Route to handle file delete
app.get('/delete/:filename', function (req, res) {
    fs.unlink(`./files/${req.params.filename}.txt`, function (err) {
        if (err) return res.send('Something went wrong');
        else res.redirect('/all-notes');
    });
});

// Route to handle search
app.post('/search', (req, res) => {
    const searchTerm = req.body.search.toLowerCase();
    fs.readdir("./files", (err, files) => {
        if (err) {
            console.error('Error reading notes directory:', err);
            return res.status(500).send('Internal Server Error');
        }
        const matchingFiles = files.filter(file => file.toLowerCase().includes(searchTerm));
        res.render('all-notes', { files: matchingFiles });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
