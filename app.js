const express = require("express");
const redis = require("redis");
const axios = require("axios");
const fetch = require("node-fetch");

const PORT = 3001;
const REDIS_PORT = 6379; // default가 있지만 explicit하게 명시

const app = express();
const client = redis.createClient({ port: REDIS_PORT }); // redis client

// event는 https://www.npmjs.com/package/redis#api 참고
client.on("connect", function (error) {
  console.error("redis is ready!");
});
client.on("error", function (error) {
  console.error(error.message);
});

// cache middlware
function cache(req, res, next) {
  const { username } = req.params;

  client.get(username, (err, data) => {
    if (err) throw err;

    if (data) {
      return res.send(`<h2>${username} has ${data} repos</h2>`);
    } else {
      next();
    }
  });
}

app.get("/repos/:username", async (req, res, next) => {
  try {
    console.log("fetching data...");
    const { username } = req.params;

    const {
      data: { public_repos },
    } = await axios(`https://api.github.com/users/${username}`);

    // set data to redis
    client.setex(username, 3600, public_repos); // set인데 ttl 설정

    res.send(`<h2>${username} has ${public_repos} repos</h2>`);
  } catch (error) {
    console.log(error.message);
    next();
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
