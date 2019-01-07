'use strict';

const process = require("process");
const express = require('express');
const bodyParser = require('body-parser');
const mj = require("mathjax-node/lib/main.js");

const port = 4010;

mj.config({  extensions: "TeX/color" });

const app = express();
app.use(bodyParser.text({extended: true}));

app.get('/svg', (req, res) => {
  const tex = req.query.tex;

  console.log("GET /svg", tex)
  res.setHeader("content-type", "image/svg+xml");

  try {
    mj.typeset({
      speakText: false,
      math: tex,
      format: "TeX",
      svg: true,
      svgNode: true,
      mml: true
    }, (result) => {
      res.send(result["svg"]);
    });
  } catch (err) {
    console.error("* A Mathjax exception occured. ", err);
    res.send();
  }
})

app.listen(port, () => {
  console.log("BookLab MathJax service listening on 0.0.0.0:"+port);
})
