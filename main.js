const express = require("express");
const fs = require("fs");
const { parse } = require("path");
const app = express();
const MainUser = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userdata/user.json`, "utf-8")
);

app.get("/api/v1/todos", (req, res) => {
  res.status(200).json({
    status: "Success",
    date: new Date(),
    result: MainUser.length,
    data: {
      MainUser,
    },
  });
});

app.get("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const check = MainUser.find((main) => main.id === id);
  if (!check) res.status(404).json({ message: "Error in getting the user" });

  res.status(200).json({
    status: "Success",
    date: new Date(),
    data: {
      check,
    },
  });
});

app.post("/api/v1/todos", (req, res) => {
  const newId = MainUser[MainUser.length - 1].id + 1;
  const object = Object.assign({ id: newId }, req.body);
  MainUser.push(object);
  fs.writeFile(
    `${__dirname}/data/userdata/user.json`,
    JSON.stringify(object),
    (err) => {
      res.status(200).json({
        status: "Success",
        date: new Date(),
        data: {
          object,
        },
      });
    }
  );
});

app.delete("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = MainUser.filter((user) => user.id !== id);
  const deleted = MainUser.splice(index, -1);
  res.status(200).json({ message: "Deleted", data: index });
});

app.patch("/api/v1/todos/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedData = req.body;
  const index = MainUser.findIndex((item) => item.id === itemId);
  if (index === 1) {
    MainUser[index] = { ...updatedData };
    res.status(200).json({ message: "Updated the user" });
  } else {
    res.status(404).json({ message: "Error invalid" });
  }
});
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running n ${port}`);
});
