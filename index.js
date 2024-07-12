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
        else res.render("index", { files:files });
    });
});

// Route to handle file creation
app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.filedata, (err) => {
        if (err) return res.send("Something went wrong");
        else res.redirect('/');
    });
});

//route to handle file read
app.get('/read/:filename', (req, res) => {
    const filename = req.params.filename;

    fs.readFile(`./files/${filename}.txt`,'utf-8',(err, fileContent) => {
        if (err) return res.send('Something went wrong');
        else res.render("show", { filename,fileContent });
    });
});

//route to handle file edit
app.get('/edit/:filename',function(req,res) 
{
  fs.readFile(`./files/${req.params.filename}.txt`,"utf-8",function(err,data)
  {
      if(err)return res.send(err.message);
      else res.render("edit",{data,filename:req.params.filename});
  });
});

// route to handle file update
app.post('/update/:filename',function(req,res)
{
    fs.writeFile(`./files/${req.params.filename}.txt`,req.body.filedata,function(err)
    {
        if(err)return res.send('Something went wrong');
        else res.redirect('/');
    });
});

//route to handle file delete
app.get('/delete/:filename',function(req,res)
{
    fs.unlink(`./files/${req.params.filename}.txt`,function(err)
    {
        if(err)return res.send('Something went wrong');
        else res.redirect('/');
    });
});
// Start the server
app.listen(3000);
