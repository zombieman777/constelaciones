// Global Error Handler for debugging
window.onerror = function (msg, url, line, col, error) {
    alert(`Error: ${msg}\nLine: ${line}\nCol: ${col}\n${error ? error.stack : ''}`);
    return false;
};

class AstronomyEngine {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;
        this.toRad = Math.PI / 180;
        this.toDeg = 180 / Math.PI;
    }

    // Convert Degrees to Radians
    rad(deg) { return deg * this.toRad; }
    // Convert Radians to Degrees
    deg(rad) { return rad * this.toDeg; }

    // Calculate Local Sidereal Time (LST) in Degrees
    getLST(date) {
        // Julian Date calculation
        const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
        const daysSinceJ2000 = (date - J2000) / 86400000;

        // Greenwich Sidereal Time (GMST)
        let GMST = 18.697374558 + 24.06570982441908 * daysSinceJ2000;
        GMST = GMST % 24;
        if (GMST < 0) GMST += 24;

        // Local Sidereal Time (LST) = GMST + Longitude/15
        let LST = GMST + (this.long / 15);
        LST = LST % 24;
        if (LST < 0) LST += 24;

        return LST * 15; // Convert hours to degrees
    }

    // Calculate Planet Position (RA/Dec) for a given Date
    getPlanetPos(planet, date) {
        // Approximate calculation using mean elements
        // d = days since J2000
        const d = (date - new Date(Date.UTC(2000, 0, 1, 12, 0, 0))) / 86400000;

        // Orbital elements
        const N = this.rad(planet.N);
        const i = this.rad(planet.i);
        const w = this.rad(planet.w);
        const a = planet.a;
        const e = planet.e;
        const M = this.rad(planet.M + (360 / 365.2422 * d / Math.pow(a, 1.5))); // Mean Anomaly updating with time

        // Eccentric Anomaly (E) - Solve Kepler's Equation M = E - e*sin(E)
        let E = M;
        for (let j = 0; j < 10; j++) {
            E = M + e * Math.sin(E);
        }

        // Heliocentric coordinates
        const xv = a * (Math.cos(E) - e);
        const yv = a * (Math.sqrt(1 - e * e) * Math.sin(E));

        const v = Math.atan2(yv, xv);
        const r = Math.sqrt(xv * xv + yv * yv);

        // Heliocentric coordinates in 3D
        const xh = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(i));
        const yh = r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(i));
        const zh = r * (Math.sin(v + w) * Math.sin(i));

        // Earth's position (Simplified)
        const N_e = 0;
        const i_e = 0;
        const w_e = this.rad(102.94719);
        const a_e = 1.00000011;
        const e_e = 0.01671022;
        const M_e = this.rad(357.52772 + 0.98560028 * d);

        // Earth E
        let E_e = M_e;
        for (let j = 0; j < 10; j++) E_e = M_e + e_e * Math.sin(E_e);

        const xv_e = a_e * (Math.cos(E_e) - e_e);
        const yv_e = a_e * (Math.sqrt(1 - e_e * e_e) * Math.sin(E_e));
        const v_e = Math.atan2(yv_e, xv_e);
        const r_e = Math.sqrt(xv_e * xv_e + yv_e * yv_e);

        const xh_e = r_e * Math.cos(v_e + w_e);
        const yh_e = r_e * Math.sin(v_e + w_e);
        const zh_e = 0;

        // Geocentric coordinates
        let xg = xh - xh_e;
        let yg = yh - yh_e;
        let zg = zh - zh_e;

        // Equatorial coordinates (rotate by obliquity of ecliptic ~23.4 degrees)
        const obl = this.rad(23.43928);
        const xeq = xg;
        const yeq = yg * Math.cos(obl) - zg * Math.sin(obl);
        const zeq = yg * Math.sin(obl) + zg * Math.cos(obl);

        const raRad = Math.atan2(yeq, xeq);
        const decRad = Math.atan2(zeq, Math.sqrt(xeq * xeq + yeq * yeq));

        let ra = this.deg(raRad) / 15; // Hours
        if (ra < 0) ra += 24;

        const dec = this.deg(decRad);

        return { ra, dec };
    }

    getMoonPos(date) {
        // Approximate Moon Calculation
        const d = (date - new Date(Date.UTC(2000, 0, 1, 12, 0, 0))) / 86400000;

        const L = this.rad(218.316 + 13.176396 * d); // Mean Longitude
        const M = this.rad(134.963 + 13.064993 * d); // Mean Anomaly
        const F = this.rad(93.272 + 13.229350 * d);  // Mean Distance to Node

        const l = L + this.rad(6.289 * Math.sin(M)); // Longitude
        const b = this.rad(5.128 * Math.sin(F));     // Latitude
        const dt = 385001 - 20905 * Math.cos(M);     // Distance (km)

        // Convert to RA/Dec
        const obl = this.rad(23.439);
        const x = Math.cos(b) * Math.cos(l);
        const y = Math.cos(obl) * Math.cos(b) * Math.sin(l) - Math.sin(obl) * Math.sin(b);
        const z = Math.sin(obl) * Math.cos(b) * Math.sin(l) + Math.cos(obl) * Math.sin(b);

        const raRad = Math.atan2(y, x);
        const decRad = Math.atan2(z, Math.sqrt(x * x + y * y));

        let ra = this.deg(raRad) / 15;
        if (ra < 0) ra += 24;

        // Calculate Phase (0 = New, 0.5 = Full, 1 = New)
        // Elongation from Sun
        // Simplified Sun Longitude
        const sunL = this.rad(280.460 + 0.9856 * d);
        const elongation = l - sunL;
        const phase = 0.5 * (1 - Math.cos(elongation));
        const angle = this.deg(elongation) % 360;

        let phaseName = "Nueva";
        if (angle > 0 && angle < 90) phaseName = "Creciente";
        else if (angle >= 90 && angle < 180) phaseName = "Gibosa Creciente";
        else if (angle >= 180 && angle < 270) phaseName = "Gibosa Menguante";
        else phaseName = "Menguante";

        if (Math.abs(angle) < 10 || Math.abs(angle - 360) < 10) phaseName = "Nueva";
        if (Math.abs(angle - 180) < 10) phaseName = "Llena";
        if (Math.abs(angle - 90) < 10) phaseName = "Cuarto Creciente";
        if (Math.abs(angle - 270) < 10) phaseName = "Cuarto Menguante";

        return {
            ra,
            dec: this.deg(decRad),
            phase,
            phaseName,
            dist: `${Math.round(dt)} km`,
            name: "Luna",
            desc: `Fase: ${phaseName} (${Math.round(phase * 100)}% iluminada).`
        };
    }

    // Convert Equatorial (RA, Dec) to Horizontal (Alt, Az)
    // RA in decimal hours, Dec in degrees
    equatorialToHorizontal(ra, dec, lst) {
        const raDeg = ra * 15;
        const ha = lst - raDeg; // Hour Angle in degrees

        const haRad = this.rad(ha);
        const decRad = this.rad(dec);
        const latRad = this.rad(this.lat);

        // Altitude
        const sinAlt = Math.sin(decRad) * Math.sin(latRad) +
            Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
        const altRad = Math.asin(sinAlt);

        // Azimuth
        const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) /
            (Math.cos(altRad) * Math.cos(latRad));

        let azRad = Math.acos(Math.max(-1, Math.min(1, cosAz)));

        // Fix Quadrant for Azimuth
        if (Math.sin(haRad) > 0) {
            azRad = 2 * Math.PI - azRad;
        }

        return {
            alt: this.deg(altRad),
            az: this.deg(azRad)
        };
    }
}

class SkyRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.showConstellations = false;
        this.showNames = false;

        // Camera State
        this.azCenter = 180; // Looking South by default
        this.altCenter = 45; // Looking half-way up
        this.zoomLevel = 1.5; // Default zoom
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Optional: Draw gradient background again if needed, or rely on CSS
        // Using clearRect lets CSS background show through
    }

    // Project Horizontal coordinates (Alt, Az) to Screen (x, y)
    // Using simple spherical rotation logic for camera
    project(alt, az) {
        if (alt < 0) return null; // Below horizon handling

        // Convert to Rad
        const azRad = (az) * (Math.PI / 180);
        const altRad = alt * (Math.PI / 180);

        // Relative logic:
        const dAz = (az - this.azCenter) * (Math.PI / 180);
        const dAlt = (alt - this.altCenter) * (Math.PI / 180);

        let dx = dAz;

        // Wrap around logic
        if (dx > Math.PI) dx -= 2 * Math.PI;
        if (dx < -Math.PI) dx += 2 * Math.PI;

        const scale = (Math.min(this.canvas.width, this.canvas.height) / 1.5) * this.zoomLevel; // Zoom level

        // Check if behind camera
        if (Math.abs(dx) > Math.PI / 2) return null;

        // Correct for altitude pinching
        const screenX = this.canvas.width / 2 + dx * Math.cos(altRad) * scale;
        const screenY = this.canvas.height / 2 - dAlt * scale; // Y is inverted

        return { x: screenX, y: screenY };
    }

    drawStar(x, y, mag, color, name) {
        const size = Math.max(0.5, 4 - mag); // Brighter stars = larger radius

        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = size * 3;
        this.ctx.shadowColor = color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset
        this.ctx.closePath();

        if (this.showNames && mag < 2.0) {
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            this.ctx.font = "10px sans-serif";
            this.ctx.fillText(name, x + 5, y + 5);
        }
    }

    drawPlanet(x, y, planet) {
        const size = 6;

        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = planet.color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = planet.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.closePath();

        // Label
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 12px sans-serif";
        this.ctx.fillText(planet.name, x + 8, y + 8);

        // Ring for Saturn
        if (planet.name === "Saturno") {
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, 10, 4, Math.PI / 4, 0, 2 * Math.PI);
            this.ctx.strokeStyle = "rgba(200, 200, 150, 0.5)";
            this.ctx.stroke();
        }
    }

    drawMoon(x, y, moon) {
        const size = 15; // Moon size

        // 1. Glow Animation (Pulse)
        const time = Date.now() * 0.002;
        const pulse = 15 + 5 * Math.sin(time); // Oscillate blur

        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        this.ctx.shadowBlur = pulse;
        this.ctx.shadowColor = "#ffffff";
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // 2. Dark side
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = "#111";
        this.ctx.fill();

        // 3. Illuminated part
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 230, 0.9)`;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = "#ffffee";
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // 4. Crater Texture (Simple procedural details)
        this.ctx.fillStyle = "rgba(0,0,0,0.1)";
        this.ctx.beginPath();
        this.ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
        this.ctx.arc(x + 4, y + 4, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Label
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 12px sans-serif";
        this.ctx.fillText(`Luna`, x + 20, y + 5);
    }

    drawHorizon() {
        // Draw a simple mountain silhouette at Alt = 0
        // We'll calculate screen Y for Alt=0 at various Azimuths

        this.ctx.fillStyle = "#0a0a10"; // Very dark blue/black
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);

        let started = false;

        // Scan across the screen width to define horizon line
        for (let sx = 0; sx <= this.canvas.width; sx += 20) {
            // Reverse project? Hard.
            // Instead, let's just draw specific azimuth points along the horizon
            // This is tricky with the current projection. 
            // Simplified approach: Draw a fixed "ground" if we are looking near horizon.
            // But the user wants "lying down" (Zenith), so horizon might be circular at edges?
            // Let's stick to drawing it if visible.

            // Actually, simply drawing a polygon based on projected Azimuths 0..360 at Alt 0
            // is better.
        }

        // Simplified: Just iterate Azimuths and draw the line
        const step = 10;
        const points = [];
        for (let az = 0; az <= 360; az += step) {
            const pos = this.project(0, az); // Altitude 0
            if (pos) points.push(pos);
        }

        if (points.length > 2) {
            this.ctx.beginPath();

            // Start from the first point
            this.ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                // Check distance to avoid drawing lines across the screen when wrapping
                const dist = Math.abs(points[i].x - points[i - 1].x);
                if (dist < 100) { // Only draw if points are close (not wrapping)
                    // Add some "mountain" noise y overlap
                    const noise = Math.sin(i * 132.1) * 10;
                    this.ctx.lineTo(points[i].x, points[i].y - noise);
                } else {
                    this.ctx.moveTo(points[i].x, points[i].y);
                }
            }

            this.ctx.strokeStyle = "#1a1a2e";
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}

class App {
    constructor() {
        this.engine = new AstronomyEngine(LOCATION.lat, LOCATION.long);
        this.renderer = new SkyRenderer('skyCanvas');
        this.visibleObjects = {}; // Cache for hit detection

        // Target for animation
        this.targetAz = null;
        this.targetAlt = null;
        this.isAnimating = false;

        this.tourIndex = -1;

        // Procedurally generate background stars
        this.backgroundStars = [];
        for (let i = 0; i < 2000; i++) {
            this.backgroundStars.push({
                ra: Math.random() * 24, // 0-24h
                dec: (Math.random() * 180) - 90, // -90 to 90 deg
                mag: 4 + Math.random() * 2, // Faint: mag 4-6
                color: Math.random() > 0.8 ? "#aaddff" : "#ffffff" // Mostly white/blueish
            });
        }

        this.initUI();
        this.startLoop();
        this.updateFacts();
        this.updateNightSummary();

        // Update facts every 10 seconds
        setInterval(() => this.updateFacts(), 10000);

        // Update summary every minute
        setInterval(() => this.updateNightSummary(), 60000);
    }

    initUI() {
        try {
            document.getElementById('toggle-constellations').addEventListener('click', (e) => {
                this.renderer.showConstellations = !this.renderer.showConstellations;
                e.target.classList.toggle('active');
            });

            document.getElementById('toggle-names').addEventListener('click', (e) => {
                this.renderer.showNames = !this.renderer.showNames;
                e.target.classList.toggle('active');
            });

            document.getElementById('view-zenith').addEventListener('click', () => {
                this.flyTo(180, 90);
            });

            // Tour Button
            document.getElementById('start-tour').addEventListener('click', () => {
                this.renderer.showConstellations = true; // Ensure lines are on
                this.nextTourStop();
            });

            // Tour Controls
            document.getElementById('next-tour').addEventListener('click', () => this.nextTourStop());
            document.getElementById('close-tour').addEventListener('click', () => {
                document.getElementById('tour-panel').style.display = 'none';
            });

            // Set Date
            const updateTime = () => {
                const now = new Date();
                document.getElementById('current-time').innerText = now.toLocaleTimeString();
            };
            setInterval(updateTime, 1000);
            updateTime();

            // Interaction - Click/Hover
            this.renderer.canvas.addEventListener('mousemove', (e) => this.handleInput(e));
            this.renderer.canvas.addEventListener('click', (e) => this.handleClick(e));

            // Interaction - Drag
            this.renderer.canvas.addEventListener('mousedown', (e) => {
                this.renderer.isDragging = true;
                this.renderer.lastX = e.clientX;
                this.renderer.lastY = e.clientY;
                this.renderer.canvas.style.cursor = 'grabbing';
            });

            window.addEventListener('mouseup', () => {
                this.renderer.isDragging = false;
                if (!this.hoveredObject) this.renderer.canvas.style.cursor = 'default';
            });

            this.tooltip = document.getElementById('star-tooltip');

            // Debug success
            console.log("UI Initialized");
        } catch (e) {
            alert("UI Init Error: " + e.message);
        }
    }

    flyTo(az, alt) {
        this.targetAz = az;
        this.targetAlt = alt;
        this.isAnimating = true;
    }

    // Removed external catalog loading to keep app self-contained and focused on local data

    nextTourStop() {
        const now = new Date();
        const lst = this.engine.getLST(now);

        // Find next visible constellation
        let found = false;
        let attempts = 0;

        while (!found && attempts < CONSTELLATION_INFO.length) {
            this.tourIndex = (this.tourIndex + 1) % CONSTELLATION_INFO.length;
            const constel = CONSTELLATION_INFO[this.tourIndex];

            // Check visibility
            const pos = this.engine.equatorialToHorizontal(constel.ra, constel.dec, lst);
            if (pos.alt > 10) { // Visible above 10 deg horizon
                found = true;

                // Fly to it
                this.flyTo(pos.az, pos.alt);

                // Show Info
                const panel = document.getElementById('tour-panel');
                panel.style.display = 'block';
                document.getElementById('tour-title').innerText = constel.name;
                document.getElementById('tour-desc').innerText = constel.desc;
            }
            attempts++;
        }

        if (!found) {
            alert("No hay más constelaciones principales visibles en este momento. ¡Prueba más tarde!");
        }
    }

    handleInput(e) {
        // Handle Drag
        if (this.renderer.isDragging) {
            this.isAnimating = false; // Stop animation if user drags
            const dx = e.clientX - this.renderer.lastX;
            const dy = e.clientY - this.renderer.lastY;

            // Sensitivity
            this.renderer.azCenter -= dx * 0.2;
            this.renderer.altCenter += dy * 0.2;

            // Clamp Altitude
            this.renderer.altCenter = Math.max(0, Math.min(90, this.renderer.altCenter));

            // Wrap Azimuth
            if (this.renderer.azCenter < 0) this.renderer.azCenter += 360;
            if (this.renderer.azCenter >= 360) this.renderer.azCenter -= 360;

            this.renderer.lastX = e.clientX;
            this.renderer.lastY = e.clientY;
            return;
        }

        // Handle Hover
        const rect = this.renderer.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let nearest = null;
        let minDist = 20;

        for (const id in this.visibleObjects) {
            const pos = this.visibleObjects[id];
            const dist = Math.sqrt(Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2));
            if (dist < minDist) {
                nearest = pos.data; // Store full object data
                minDist = dist;
            }
        }

        this.hoveredObject = nearest; // Store for click

        if (nearest) {
            this.renderer.canvas.style.cursor = 'pointer';
        } else {
            this.renderer.canvas.style.cursor = 'grab'; // Default cursor indicates draggable
        }
    }

    handleClick(e) {
        if (this.renderer.isDragging) return; // Don't click if dragging

        if (this.hoveredObject) {
            const rect = this.renderer.canvas.getBoundingClientRect();
            this.showTooltip(this.hoveredObject, e.clientX - rect.left, e.clientY - rect.top);
        } else {
            this.hideTooltip();
        }
    }

    showTooltip(obj, x, y) {
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = (x + 15) + 'px';
        this.tooltip.style.top = (y + 15) + 'px';

        document.getElementById('tooltip-name').innerText = obj.name;
        document.getElementById('tooltip-dist').innerText = obj.dist ? `Distancia: ${obj.dist}` : '';
        document.getElementById('tooltip-desc').innerText = obj.desc || "Sin datos adicionales.";
    }

    hideTooltip() {
        this.tooltip.style.display = 'none';
    }

    updateFacts() {
        const factEl = document.getElementById('curious-fact');
        const placeEl = document.getElementById('observable-place');

        // Fade out
        factEl.classList.add('fade-out');
        placeEl.classList.add('fade-out');

        setTimeout(() => {
            // Update content
            const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
            const randomPlace = OBSERVABLE_PLACES[Math.floor(Math.random() * OBSERVABLE_PLACES.length)];

            factEl.innerText = randomFact;
            placeEl.innerHTML = `<strong>${randomPlace.name}</strong><br>${randomPlace.desc}`;

            // Fade in
            factEl.classList.remove('fade-out');
            placeEl.classList.remove('fade-out');
        }, 500); // Wait for transition
    }

    updateNightSummary() {
        const now = new Date();
        const lst = this.engine.getLST(now);
        const summaryEl = document.getElementById('night-summary-content');

        // 1. Check Moon
        const moon = this.engine.getMoonPos(now);
        const moonHor = this.engine.equatorialToHorizontal(moon.ra, moon.dec, lst);
        const moonVis = moonHor.alt > 0;

        let html = `<div class="summary-item">
            <strong>Luna:</strong> ${moon.phaseName} <br>
            <span class="${moonVis ? 'visible' : 'not-visible'}">
                ${moonVis ? 'Visible ahora' : 'Bajo el horizonte'}
            </span>
        </div>`;

        // 2. Check Planets
        const visiblePlanets = [];
        PLANETS.forEach(p => {
            const pEq = this.engine.getPlanetPos(p, now);
            const pHor = this.engine.equatorialToHorizontal(pEq.ra, pEq.dec, lst);
            if (pHor.alt > 0) visiblePlanets.push(p.name);
        });

        html += `<div class="summary-item"><strong>Planetas Visibles:</strong><br>`;
        if (visiblePlanets.length > 0) {
            html += `<span class="visible">${visiblePlanets.join(', ')}</span>`;
        } else {
            html += `<span class="not-visible">Ninguno por ahora</span>`;
        }
        html += `</div>`;

        // 3. Local Events from Planetario de Medellín
        if (typeof LOCAL_EVENTS !== 'undefined') {
            html += `<div class="summary-item" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;">
                <strong>Eventos del Mes (Planetario Medellín):</strong><br>
                <ul style="padding-left: 15px; margin: 5px 0; font-size: 0.9em; color: #aaddff;">`;

            // Show next 2 upcoming events
            const today = now.toISOString().split('T')[0];
            const upcoming = LOCAL_EVENTS.filter(e => e.date >= today).slice(0, 3);

            if (upcoming.length > 0) {
                upcoming.forEach(e => {
                    html += `<li>${e.date.slice(5)}: ${e.desc}</li>`;
                });
            } else {
                html += `<li>Consulta la programación del Planetario.</li>`;
            }
            html += `</ul></div>`;
        }

        summaryEl.innerHTML = html;
    }

    update() {
        const now = new Date();
        const lst = this.engine.getLST(now);

        // Animation Logic
        if (this.isAnimating) {
            // Lerp towards target
            const speed = 0.05;

            // Azimuth shortest path
            let dAz = this.targetAz - this.renderer.azCenter;
            while (dAz > 180) dAz -= 360;
            while (dAz < -180) dAz += 360;

            this.renderer.azCenter += dAz * speed;
            this.renderer.altCenter += (this.targetAlt - this.renderer.altCenter) * speed;

            // Check completion
            if (Math.abs(dAz) < 0.5 && Math.abs(this.targetAlt - this.renderer.altCenter) < 0.5) {
                this.isAnimating = false;
            }

            // Wrap Az
            if (this.renderer.azCenter < 0) this.renderer.azCenter += 360;
            if (this.renderer.azCenter >= 360) this.renderer.azCenter -= 360;
        }

        this.renderer.clear();
        this.visibleObjects = {}; // Reset

        // Map star names to coordinates
        const starMap = {};

        // 0. Draw Background Stars (Aesthetic Only)
        this.backgroundStars.forEach(star => {
            const pos = this.engine.equatorialToHorizontal(star.ra, star.dec, lst);
            const screenPos = this.renderer.project(pos.alt, pos.az);
            if (screenPos) {
                // Simplified drawing for background stars
                this.renderer.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                this.renderer.ctx.fillRect(screenPos.x, screenPos.y, 1, 1);
            }
        });

        // 0.5 Draw Horizon (Mountains)
        this.renderer.drawHorizon();

        // 1. Bright Stars (Interactive)
        STARS.forEach(star => {
            const pos = this.engine.equatorialToHorizontal(star.ra, star.dec, lst);
            const screenPos = this.renderer.project(pos.alt, pos.az);

            if (screenPos) {
                // Twinkle effect
                const time = Date.now() * 0.002;
                // Unique phase for each star based on its RA
                const randomPhase = star.ra * 10;
                const twinkle = 0.7 + 0.3 * Math.sin(time + randomPhase);

                this.renderer.ctx.globalAlpha = twinkle;
                this.renderer.drawStar(screenPos.x, screenPos.y, star.mag, star.color, star.name);
                this.renderer.ctx.globalAlpha = 1.0; // Reset

                starMap[star.name] = screenPos;
                this.visibleObjects[star.name] = { x: screenPos.x, y: screenPos.y, data: star };
            }
        });

        // 2. Planets (Dynamic Calculation)
        PLANETS.forEach(planet => {
            // Calculate current RA/Dec
            const planetEq = this.engine.getPlanetPos(planet, now);
            const pos = this.engine.equatorialToHorizontal(planetEq.ra, planetEq.dec, lst);
            const screenPos = this.renderer.project(pos.alt, pos.az);

            if (screenPos) {
                this.renderer.drawPlanet(screenPos.x, screenPos.y, planet);
                this.visibleObjects[planet.name] = { x: screenPos.x, y: screenPos.y, data: planet };
            }
        });

        // 3. Moon
        const moon = this.engine.getMoonPos(now);
        const moonPos = this.engine.equatorialToHorizontal(moon.ra, moon.dec, lst);
        const moonScreen = this.renderer.project(moonPos.alt, moonPos.az);
        if (moonScreen) {
            this.renderer.drawMoon(moonScreen.x, moonScreen.y, moon);
            this.visibleObjects["Luna"] = { x: moonScreen.x, y: moonScreen.y, data: moon };
        }

        // 4. Constellations
        if (this.renderer.showConstellations) {
            CONSTELLATIONS.forEach(pair => {
                const s1 = starMap[pair[0]];
                const s2 = starMap[pair[1]];
                if (s1 && s2) {
                    this.renderer.drawLine(s1.x, s1.y, s2.x, s2.y);
                }
            });
        }

        // 4. Draw Horizon Compass
        const cardinals = [
            { name: "N", az: 0 }, { name: "E", az: 90 }, { name: "S", az: 180 }, { name: "O", az: 270 }
        ];

        this.renderer.ctx.font = "bold 14px sans-serif";
        this.renderer.ctx.fillStyle = "rgba(100, 255, 218, 0.8)";
        this.renderer.ctx.textAlign = "center";

        cardinals.forEach(c => {
            const pos = this.renderer.project(0, c.az); // Altitude 0 (Horizon)
            if (pos) {
                this.renderer.ctx.fillText(c.name, pos.x, pos.y + 20);
                this.renderer.ctx.fillRect(pos.x - 1, pos.y - 5, 2, 10); // Marker
            }
        });
    }

    startLoop() {
        const loop = () => {
            try {
                this.update();
                requestAnimationFrame(loop);
            } catch (e) {
                console.error("Critical Error in Loop:", e);
                alert("Critical Error: " + e.message + "\n" + e.stack);
            }
        };
        loop();
    }
}

// Start App
window.onload = () => {
    try {
        if (typeof AstronomyEngine === 'undefined') throw new Error("AstronomyEngine class not found. Check app.js syntax.");
        if (typeof LOCATION === 'undefined') throw new Error("LOCATION not found. Check data.js loading.");
        new App();
    } catch (e) {
        alert("Startup Error: " + e.message);
    }
};
