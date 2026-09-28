const fs = require("fs");
const { importDataToDB, emptyDB } = require("./seed.js");
const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");
const obj = {
  user: { model: User, filePath: `${__dirname}/user.json` },
  product: { model: Product, filePath: `${__dirname}/product.json` },
};
//console.log(__dirname)
const list = JSON.parse(
  fs.readFileSync(obj[process.argv[3]].filePath, "utf-8")
);
if (process.argv[2] === "--import") {
  importDataToDB(obj[process.argv[3]].model, list);
} else if (process.argv[2] === "--delete") {
  emptyDB(obj[process.argv[3]].model);
}