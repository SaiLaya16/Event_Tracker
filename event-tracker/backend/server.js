const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Event Tracker Backend is Running");
});

app.get("/api/events", (req, res) => {
    const sql = "SELECT * FROM events";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Error fetching events"
            });
        }

        res.json(results);
    });
});

app.get("/api/events/:id", (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM events WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Error fetching event"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json(results[0]);
    });
});

app.get("/api/events/status/:status", (req, res) => {
    const status = req.params.status;

    const sql = "SELECT * FROM events WHERE status = ?";

    db.query(sql, [status], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Error fetching events by status"
            });
        }

        res.json(results);
    });
});

// POST API 1 - Create a new event
app.post("/api/events", (req, res) => {
    const { title, description, event_date, location, organizer, status } = req.body;

    const sql = `
        INSERT INTO events
        (title, description, event_date, location, organizer, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, event_date, location, organizer, status],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Error creating event"
                });
            }

            res.status(201).json({
                message: "Event created successfully",
                eventId: result.insertId
            });
        }
    );
});

// POST API 2 - Quick create event
app.post("/api/events/quick", (req, res) => {
    const { title, event_date } = req.body;

    const sql = `
        INSERT INTO events
        (title, event_date, status)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [title, event_date, "Upcoming"],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Error creating quick event"
                });
            }

            res.status(201).json({
                message: "Quick event created successfully",
                eventId: result.insertId
            });
        }
    );
});

// POST API 3 - Search events
app.post("/api/events/search", (req, res) => {
    const { keyword } = req.body;

    const sql = `
        SELECT * FROM events
        WHERE title LIKE ?
        OR description LIKE ?
        OR location LIKE ?
        OR organizer LIKE ?
    `;

    const searchKeyword = `%${keyword}%`;

    db.query(
        sql,
        [searchKeyword, searchKeyword, searchKeyword, searchKeyword],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Error searching events"
                });
            }

            res.json(results);
        }
    );
});


// PUT API 1 - Update complete event
app.put("/api/events/:id", (req, res) => {
    const id = req.params.id;

    const {
        title,
        description,
        event_date,
        location,
        organizer,
        status
    } = req.body;

    const sql = `
        UPDATE events
        SET title = ?,
            description = ?,
            event_date = ?,
            location = ?,
            organizer = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, description, event_date, location, organizer, status, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Error updating event"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }

            res.json({
                message: "Event updated successfully"
            });
        }
    );
});

// PUT API 2 - Update event status
app.put("/api/events/:id/status", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const sql = "UPDATE events SET status = ? WHERE id = ?";

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Error updating event status"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event status updated successfully"
        });
    });
});

// PUT API 3 - Reschedule event
app.put("/api/events/:id/reschedule", (req, res) => {
    const id = req.params.id;
    const { event_date } = req.body;

    const sql = "UPDATE events SET event_date = ? WHERE id = ?";

    db.query(sql, [event_date, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Error rescheduling event"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event rescheduled successfully"
        });
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});