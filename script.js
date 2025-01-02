const movies = [
    {
        title: "kish kinda kandam",
        genre: "crime",
        release: "2024",
        showtime: "7:00 am,10:00 am,2:00 pm",
        date: "2024-12-20",
        image:  "./assets/images/kish kinda kandam.jpg",
    },
    {
        title: "Thekku vadakku",
        genre: "comedy",
        release: "2024",
        showtime: "7:00 am,10:00 am,2:00 pm",
        date: "2024-12-21",
        image: "./assets/images/thekku vadu,kku.jpg",
    },
    {
        title: "Pushpa 2 the rule",
        genre: "Action",
        release: "2024",
        showtime: "7:00 am,10:00 am,2:00 pm",
        date: "2024-12-26",
        image:"./assets/images/pushpa 2.jpg",
    },
    {
        title: "Lucky baskar",
        genre: "crime",
        release: "2024",
        showtime: "7:00 am,10:00 am,2:00 pm",
        date: "2024-01-03",
        image: "./assets/images/lb.jpg",
    },
];

document.addEventListener("DOMContentLoaded", () => {
    displayMovies(movies);
});

document.getElementById("search-btn").addEventListener("click", function () {
    const query = document.getElementById("movie-search").value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );
    displayMovies(filteredMovies);
});

function displayMovies(movies) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = ""; // Clear previous results
    if (movies.length === 0) {
        movieList.innerHTML = "<p>No movies found</p>";
        return;
    }

    movies.forEach(movie => {
        const movieItem = document.createElement("div");
        movieItem.className = "movie-item";
        movieItem.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>Genre: ${movie.genre}</p>
            <p>Release Year: ${movie.release}</p>
            <p>Showtime: ${movie.showtime}</p>
            <p>Date: ${movie.date}</p>
            <button class="select-btn" data-title="${movie.title}">Select</button>
        `;
        movieList.appendChild(movieItem);
    });

    document.querySelectorAll(".select-btn").forEach(button =>
        button.addEventListener("click", (event) => {
            const selectedMovie = event.target.getAttribute("data-title");
            openSeatSelection(selectedMovie);
        })
    );
}

function openSeatSelection(movieTitle) {
    document.getElementById("seat-movie-title").textContent = `Select Seats for ${movieTitle}`;
    document.getElementById("seat-selection").classList.remove("hidden");
    generateSeatGrid();

    // Add event listeners for Confirm and Cancel buttons
    document.getElementById("confirm-btn").onclick = () => {
        alert("Seats confirmed!");
        document.getElementById("seat-selection").classList.add("hidden");
    };
    document.getElementById("cancel-btn").onclick = () => {
        document.getElementById("seat-selection").classList.add("hidden");
    };
}

function generateSeatGrid() {
    const seatGrid = document.getElementById("seat-grid");
    seatGrid.innerHTML = ""; // Clear previous grid

    const rows = 5;
    const cols = 8;
    const reservedSeats = ["2-4", "3-5"]; // Example of reserved seats

    for (let row = 1; row <= rows; row++) {
        const tr = document.createElement("tr");
        for (let col = 1; col <= cols; col++) {
            const td = document.createElement("td");
            const seatId = `${row}-${col}`;
            td.textContent = seatId;

            if (reservedSeats.includes(seatId)) {
                td.classList.add("reserved");
            } else {
                td.onclick = () => toggleSeatSelection(td);
            }

            tr.appendChild(td);
        }
        seatGrid.appendChild(tr);
    }
}

function toggleSeatSelection(cell) {
    if (cell.classList.contains("reserved")) return;

    cell.classList.toggle("selected");
    updateSelectedSeats();
}

function updateSelectedSeats() {
    const selectedSeats = Array.from(document.querySelectorAll(".seat-table td.selected"))
        .map(cell => cell.textContent)
        .join(", ");
    document.getElementById("selected-seats").textContent = `Selected Seats: ${selectedSeats || "None"}`;
}

document.getElementById("send-email-btn").addEventListener("click", () => {
    const customerEmail = document.getElementById("customer-email").value;
    const selectedSeats = Array.from(document.querySelectorAll(".seat-table td.selected"))
        .map(cell => cell.textContent)
        .join(", ");
    const movieTitle = document.getElementById("seat-movie-title").textContent.replace("Select Seats for ", "");

    if (!customerEmail) {
        alert("Please enter your email address!");
        return;
    }

    if (!selectedSeats) {
        alert("Please select at least one seat!");
        return;
    }

    // Send email using EmailJS
    emailjs
        .send("service_ehjqm38", "template_aikynap", {
            movie_title: movieTitle,
            selected_seats: selectedSeats,
            customer_email: customerEmail,
        })
        .then(() => {
            alert("Confirmation email sent successfully!");
            document.getElementById("seat-selection").classList.add("hidden");
        })
        .catch((error) => {
            console.error("Failed to send email:", error);
            alert("Failed to send confirmation email. Please try again.");
        });
});
document.getElementById("send-email-btn").addEventListener("click", () => {
    const customerEmail = document.getElementById("customer-email").value.trim();
    const selectedSeats = Array.from(document.querySelectorAll(".seat-table td.selected"))
        .map(cell => cell.textContent)
        .join(", ");
    const movieTitle = document.getElementById("seat-movie-title").textContent.replace("Select Seats for ", "");

    if (!customerEmail) {
        alert("Please enter your email address!");
        return;
    }

    if (!selectedSeats) {
        alert("Please select at least one seat!");
        return;
    }

    // Send email using EmailJS
    emailjs
        .send("service_ehjqm38", "template_aikynap", {
            movie_title: movieTitle,
            selected_seats: selectedSeats,
            customer_email: customerEmail,
        })
        .then(() => {
            alert(`Confirmation email sent to ${customerEmail}!`);
            document.getElementById("seat-selection").classList.add("hidden");
        })
        .catch((error) => {
            console.error("Failed to send email:", error);
            alert("Failed to send confirmation email. Please try again.");
        });
})
document.getElementById("send-email-btn").addEventListener("click", () => {
    const email = document.getElementById("customer-email").value;
    const seats = document.getElementById("selected-seats").innerText;
    const movieTitle = document.getElementById("seat-movie-title").innerText;

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    // Send data to the backend (Node.js)
    fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_name: "Customer",
            user_email: email,
            movie_name: movieTitle,
            seats: seats
        })
    })
    .then(response => {
        if (response.ok) {
            alert("Email Sent Successfully!");
        } else {
            alert("Failed to send email.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error connecting to the server.");
    });
});
document.getElementById("send-email-btn").addEventListener("click", async () => {
    const user_name = "Suryan";  // Example name
    const user_email = document.getElementById("customer-email").value;  // Get email from input
    const movie_name = "Inception";  // Example movie
    const seats = ["A1", "A2"];  // Example seat selection

    if (!user_email) {
        alert("Please enter an email address.");
        return;
    }

    const payload = {
        user_name,
        user_email,
        movie_name,
        seats
    };

    try {
        const response = await fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.text();
        alert(result);  // Show success message
    } catch (error) {
        alert("Failed to send email.");
        console.error("Error:", error);
    }
});
