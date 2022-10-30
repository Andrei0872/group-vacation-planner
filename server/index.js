import express from "express";
import { pool } from "./db/index.js";

const PORT = 8080;

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ msg: "hello!" });
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));

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

console.log("pool");
