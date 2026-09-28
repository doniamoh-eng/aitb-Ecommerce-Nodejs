const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const dbAtlasString = process.env.DB.replace("<password>",process.env.DB_PASSWORD);
exports.importDataToDB = (Model, list) => {
  Model.create(list).then((res) => {
      console.log("Data Imported successfully");
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      process.exit();
    });
};
exports.emptyDB = (Model) => {
  Model.deleteMany().then(() => {
      console.log("Database deleted successfully.");
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      process.exit();
    });
};
mongoose.connect(dbAtlasString).then((con) => {
    console.log("DB Connected Successfully...");
  })
  .catch((err) => {
    console.log(err.message);
  });
