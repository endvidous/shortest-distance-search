const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const cities = [];
let start = null;
let end = null;
let solved = false;
let selectingStartPoint = false;
let selectingEndPoint = false;

canvas.addEventListener("click", (event) => {
    if (!solved) {
        const x = event.offsetX;
        const y = event.offsetY;
        
        if (start && selectingStartPoint) {
            alert("Start point already selected. Clear it to select a new one.");
            return;
        }
        
        if (end && selectingEndPoint) {
            alert("End point already selected. Clear it to select a new one.");
            return;
        }
        
        if (selectingStartPoint) {
            start = { x, y };
            drawCity(x, y, "green"); // Draw start point in green
            selectingStartPoint = false; // Clear the selection
        } else if (selectingEndPoint) {
            end = { x, y }; 
            drawCity(x, y, "red"); // Draw end point in red
            selectingEndPoint = false; // Clear the selection
        } else {
            cities.push({ x, y });
            drawCity(x, y);
        }
    }
});

function selectStartPoint() {
    selectingStartPoint = true;
    selectingEndPoint = false;
}

function selectEndPoint() {
    selectingStartPoint = false;
    selectingEndPoint = true;
}

function clearPoints() {
    start = null;
    end = null;
    selectingStartPoint = false;
    selectingEndPoint = false;
    cities.length = 0; // Clear the cities array
    clearCanvas();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    solved = false;
}

function drawCity(x, y, color = "black") {
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function calculateTotalDistance(path) {
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const cityA = path[i];
        const cityB = path[i + 1];
        totalDistance += calculateDistance(cityA, cityB);
    }
    return totalDistance;
}

function drawPath(path) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    cities.forEach(city => drawCity(city.x, city.y));
    drawCity(start.x, start.y, "green");
    drawCity(end.x, end.y, "red");

    context.beginPath();
    context.moveTo(start.x, start.y);
    for (let i = 0; i < path.length; i++) {
        context.lineTo(path[i].x, path[i].y);
    }
    context.lineTo(end.x, end.y);
    context.strokeStyle = "red";
    context.stroke();
    context.closePath();
    
    // Draw lines connecting the points with an arrow at the end
    for (let i = 1; i < path.length; i++) {
        drawArrow(path[i - 1], path[i]);
    }
}

function drawArrow(startPoint, endPoint) {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    // Arrowhead length and width
    const arrowLength = 15;
    const arrowWidth = 10;

    // Calculate arrowhead points
    const arrowX1 = endPoint.x - arrowLength * Math.cos(angle - Math.PI / 6);
    const arrowY1 = endPoint.y - arrowLength * Math.sin(angle - Math.PI / 6);
    const arrowX2 = endPoint.x - arrowLength * Math.cos(angle + Math.PI / 6);
    const arrowY2 = endPoint.y - arrowLength * Math.sin(angle + Math.PI / 6);

    // Draw the line
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.strokeStyle = "blue";
    context.stroke();
    context.closePath();

    // Draw the arrowhead
    context.beginPath();
    context.moveTo(endPoint.x, endPoint.y);
    context.lineTo(arrowX1, arrowY1);
    context.lineTo(arrowX2, arrowY2);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function solveTSP() {
    if (cities.length < 2 || !start || !end) {
        alert("Please add at least two cities and specify both start and end points.");
        return;
    }

    if (!solved) {
        const shortestPath = findShortestPath(start, end);
        
        if (shortestPath) {
            drawPath(shortestPath);
            
            document.getElementById("totalDistance").textContent = calculateTotalDistance(shortestPath).toFixed(2);
            solved = true;
        } else {
            alert("No path found between the start and end points.");
        }
    }
}

function findShortestPath(start, end) {
    if (cities.length < 2) {
        return null; // Cannot find a path with less than 2 cities
    }

    // Create a copy of cities array to avoid modifying the original
    const unvisitedCities = [...cities];
    const path = [start];

    let currentPoint = start;

    while (path.length < cities.length) {
        let nearestCity = null;
        let shortestDistance = Infinity;

        for (const city of unvisitedCities) {
            const distance = calculateDistance(currentPoint, city);
            if (distance < shortestDistance) {
                nearestCity = city;
                shortestDistance = distance;
            }
        }

        path.push(nearestCity);
        unvisitedCities.splice(unvisitedCities.indexOf(nearestCity), 1);
        currentPoint = nearestCity;
    }

    path.push(end);
    return path;
}

function calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}