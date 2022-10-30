import express from "express";
import jwt from "jsonwebtoken";
import { pool } from './db/index.js'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io';

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: {
  origin:' *'
} });

app.get('/test', (req, res) => {
  res.json({ msg: 'hello!' });
});

app.get("/activities-categories", async (req, res) => {
  const client = await pool.connect();
  let allCategories = await client.query("SELECT enum_range(NULL::category)");
  res.json({ data: allCategories.rows[0].enum_range.slice(1, -1).split(",") });

  client.release();
});

app.get("/activities", async (req, res) => {
  const rawFilter = req.query.filter || "all";

  const filters = rawFilter.split(",").map((a) => `'${a}'`);

  const client = await pool.connect();
  let result;
  try {
    if (rawFilter == "all") {
      result = await client.query(`SELECT * FROM activity`);
    } else {
      result = await client.query(`
        SELECT * FROM activity WHERE
        activity.category && ARRAY[${filters}]::category[];
      `);
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the data." });
  } finally {
    client.release();
  }

  res.json({ data: result.rows });
});


app.post("/save-trip", async (req, res) => {
  const body = req.body;
  console.log(body);

  // insert new trip
  const client = await pool.connect();
  console.log(body.trip.start_date);
  let values = [
    body.trip.start_date,
    body.trip.end_date,
    body.trip.organiser_id,
  ];
  try {
    let res = await client.query(
      "INSERT INTO trip(start_date, end_date, organiser_id) VALUES($1, $2, $3) RETURNING id",
      values
    );
    const tripId = res.rows[0].id;

    // insert in trip activity
    for (let i = 0; i < body.activities.length; i++) {
      values = [
        tripId,
        body.activities[i].activity_id,
        body.activities[i].day_number,
        body.activities[i].order_number,
        body.activities[i].visiting_time,
        body.activities[i].note,
      ];
      res = await client.query(
        "INSERT INTO trip_activity(trip_id, activity_id, day_number, order_number, visiting_time, note) VALUES($1, $2, $3, $4, $5, $6)",
        values
      );
    }

    for (let i = 0; i < body.members.length; i++) {
      values = [body.members[i], tripId];
      res = await client.query(
        "INSERT INTO trip_members(user_id, trip_id) VALUES($1, $2)",
        values
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }

  res.status(201).json({ message: "trip sucessfully added!" });
});
const inviteTokens = {};
app.post("/generateToken", (req, res) => {
  let jwtSecretKey = "secret-key";
  let data = {
    time: Date(),
    organiser_id: 1,
    trip_id: 1,
  };

  const token = jwt.sign(data, jwtSecretKey);
  inviteTokens[token] = [1, 1];
  res.cookie("jwt", token);
  res.send(token);
});

app.post("/session/:jwt", (req, res) => {
  // token validation
  const token = req.params.jwt;
  let jwtSecretKey = "secret-key";

  try {
    const verified = jwt.verify(token, jwtSecretKey);

    if (verified && token in inviteTokens) {
      res.send("Successfully Verified");
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }

  const memberId = req.body.member_id;
  io.emit('guestJoined', { id: memberId, name: `name-${memberId}` })
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // io.emit('guestJoined', { id: 7, name: 'foo' })

  // setTimeout(() => io.emit('guestJoined', { id: 8, name: 'foo' }), 3000)
});

server.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
// app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));

console.log("pool");
