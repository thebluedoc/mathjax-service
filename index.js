'use strict';

const redis = require('redis');
const process = require("process");
const express = require('express');
const bodyParser = require('body-parser');
const mj = require("mathjax-node/lib/main.js");

const port = 4010;
const redisURL = process.env.REDIS_URL || 'redis://localhost:6379/1';
const redisClient = redis.createClient(redisURL);
const cacheTTL = 7 * 24 * 60 * 60;

mj.config({  extensions: "TeX/color" });

const app = express();
app.use(bodyParser.text({extended: true}));

const generateCacheKey = (key) => {
  return "mathjax-v1-" + key;
}

app.get('/svg', (req, res) => {
  const tex = req.query.tex;

  console.log("GET /svg", tex)
  res.setHeader("content-type", "image/svg+xml");

  const cacheKey = generateCacheKey(tex);
  const cacheObj = redisClient.get(cacheKey);
  if (cacheObj) {
    console.log("cache hit", cacheKey);
    res.send(cacheObj);
    return;
  }

  try {
    mj.typeset({
      speakText: false,
      math: tex,
      format: "TeX",
      svg: true,
      svgNode: true,
      mml: true
    }, (result) => {
      redisClient.setex(cacheKey, cacheTTL, result['svg']);
      console.log("cache write", cacheKey);
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
