const API_URL = "http://localhost:5000/api/events";

// Get and display all events
async function loadEvents() {
    try {
        const response = await fetch(API_URL);
        const events = await response.json();

        const eventsContainer = document.getElementById("events");

        eventsContainer.innerHTML = "";

        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.className = "event-card";
    eventCard.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Description:</strong> ${event.description || "N/A"}</p>
        <p><strong>Date:</strong> ${event.event_date}</p>
        <p><strong>Location:</strong> ${event.location || "N/A"}</p>
        <p><strong>Organizer:</strong> ${event.organizer || "N/A"}</p>
        <p><strong>Status:</strong> ${event.status || "N/A"}</p>

        <button onclick="updateStatus(${event.id})">
            Mark as Completed
        </button>

        <button onclick="editEvent(${event.id})">
    Edit Event
</button>

<button onclick="rescheduleEvent(${event.id})">
    Reschedule
</button>
    `;

            eventsContainer.appendChild(eventCard);
        });

    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Load events when page opens
loadEvents();

// Add a new event
async function addEvent() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const event_date = document.getElementById("event_date").value;
    const location = document.getElementById("location").value;
    const organizer = document.getElementById("organizer").value;
    const status = document.getElementById("status").value;

    if (!title || !event_date) {
        alert("Please enter Event Title and Event Date");
        return;
    }

    const eventData = {
        title,
        description,
        event_date,
        location,
        organizer,
        status
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Event added successfully!");

            // Clear the form
            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            document.getElementById("event_date").value = "";
            document.getElementById("location").value = "";
            document.getElementById("organizer").value = "";
            document.getElementById("status").value = "Upcoming";

            // Reload events
            loadEvents();
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error("Error adding event:", error);
        alert("Unable to connect to server");
    }
}

// Update event status
async function updateStatus(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "Completed"
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Event status updated successfully!");
            loadEvents();
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error("Error updating status:", error);
        alert("Unable to connect to server");
    }
}

// Edit an existing event
async function editEvent(id) {
    const title = prompt("Enter new event title:");
    if (title === null) return;

    const description = prompt("Enter new description:");
    if (description === null) return;

    const event_date = prompt("Enter new date (YYYY-MM-DD):");
    if (event_date === null) return;

    const location = prompt("Enter new location:");
    if (location === null) return;

    const organizer = prompt("Enter new organizer:");
    if (organizer === null) return;

    const status = prompt("Enter status (Upcoming / Completed / Cancelled):");
    if (status === null) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                event_date,
                location,
                organizer,
                status
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Event updated successfully!");
            loadEvents();
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error("Error updating event:", error);
        alert("Unable to connect to server");
    }
}

// Reschedule an event
async function rescheduleEvent(id) {
    const event_date = prompt("Enter new event date (YYYY-MM-DD):");

    if (event_date === null) return;

    if (!event_date) {
        alert("Please enter a date");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}/reschedule`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event_date
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Event rescheduled successfully!");
            loadEvents();
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error("Error rescheduling event:", error);
        alert("Unable to connect to server");
    }
}