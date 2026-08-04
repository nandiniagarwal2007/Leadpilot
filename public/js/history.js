async function loadHistory() {

    try {

        const response = await fetch("/history");

        const history = await response.json();

        const container = document.getElementById("historyContainer");

        let total = history.length;
        let sent = 0;
        let skipped = 0;

        let table = `
            <table>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Status</th>
                </tr>
        `;

        history.forEach(item => {

            if (item.status === "SENT") {
                sent++;
            } else {
                skipped++;
            }

            table += `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td>${item.name}</td>
                    <td>${item.company}</td>
                    <td>${item.email}</td>
                    <td>
                        <span class="status ${item.status === "SENT" ? "sent" : "pending"}">
                            ${item.status}
                        </span>
                    </td>
                </tr>
            `;

        });

        table += "</table>";

        container.innerHTML = table;

        document.getElementById("totalCampaigns").textContent = total;
        document.getElementById("sentCount").textContent = sent;
        document.getElementById("skippedCount").textContent = skipped;

    } catch (error) {

        console.log(error);

    }

}

loadHistory();