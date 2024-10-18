// import {exress} from 'express';
// import {json} from 'body-parser';
const express = require('express');
const json = require('body-parser');
// const csv = require("csvtojson");
const {parse} = require("csv-parse");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

app.get('/data', async(req, res) => {
    const csvFilePath = "./data.csv";
    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
  
    const parser = parse(fileContent, {
      delimiter: ";",
    });
  
    const records = [];
  
    try {
        for await (const record of parser) {
            records.push(record);
        }
        console.log("record", records);
        res.send(records).status(200);
    } catch (error) {
      console.error(error);
      res.send(error).status(500);
    }
  
    // return Response.json(records);
});

app.listen(3000, () => {
    console.log("listening on port 3000");
})
