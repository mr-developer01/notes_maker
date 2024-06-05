const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    // console.log(files);
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  //   console.log(req.body);
  const words = req.body.title.split(" ");
  const capitalizedWords = words.map((word, index) => {
    if (index === 0) {
      return word;
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });
  const result = capitalizedWords.join("");
  //   console.log(result);
  fs.writeFile(`./files/${result}.txt`, req.body.details, (err) => {
    res.redirect("/");
  });
});

app.get("/del/:delFile", (req, res) => {
  fs.unlink(`./files/${req.params.delFile}`, (err) => {
    res.redirect("/");
  });
});

app.get("/readData/:file", (req, res) => {
  let filename = req.params.file;
  let dotIndex = filename.lastIndexOf(".");
  let filenameWithoutExtension = filename.substring(0, dotIndex);
  let mainTitleWithoutExtension =
    filenameWithoutExtension.charAt(0).toUpperCase() +
    filenameWithoutExtension.slice(1);

  // Split the combined names into an array of individual names
  let individualNames = mainTitleWithoutExtension.match(/[A-Z][a-z]*/g);
  const fileTitle = individualNames.join(" ")
  fs.readFile(`./files/${req.params.file}`, "utf8", (err, data) => {
    res.render("read", { fileData: data, title: fileTitle, filename: filename });
  });
});

app.get("/editNote/:noteFile", (req, res) => {
    fs.readFile(`./files/${req.params.noteFile}`, "utf-8", (err, data) => {
        console.log(data);
        const url = req.params.noteFile;
        res.render("edit", {data, url})
    })
})

app.post("/update", (req, res) => {
    fs.writeFile(`./files/${req.body.url}`, `${req.body.updatedText}`, (err) => {
        res.redirect(`/readData/${req.body.url}`)
    })
})

app.listen(3000, () => {
  console.log("Server is running...");
});