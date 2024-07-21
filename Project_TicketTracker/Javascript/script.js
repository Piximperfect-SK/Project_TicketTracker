const maxAgents = 5; /* Maximum number of agents allowed */
        let agents = {}; /* Object to store agent data */

        /**
         * Updates the table with current agent data and calculates the total count.
         */
        function updateTable() {
            const tableBody = document.getElementById('agentTableBody');
            tableBody.innerHTML = '';

            let totalCount = 0;

            for (const [agent, data] of Object.entries(agents)) {
                const row = document.createElement('tr');

                // Agent name cell
                const agentCell = document.createElement('td');
                agentCell.textContent = agent;

                // Timing cell
                const timingCell = document.createElement('td');
                timingCell.textContent = data.timing;
                timingCell.contentEditable = true; /* Make cell editable */
                timingCell.addEventListener('blur', () => {
                    agents[agent].timing = timingCell.textContent.trim();
                });

                // Count cell
                const countCell = document.createElement('td');
                countCell.textContent = data.count;
                totalCount += data.count;

                // Actions cell
                const actionCell = document.createElement('td');

                // Increase button
                const increaseBtn = document.createElement('button');
                increaseBtn.textContent = '+';
                increaseBtn.className = 'action-btn action-btn-add';
                increaseBtn.onclick = (event) => {
                    event.stopPropagation();
                    changeTicketCount(agent, 1);
                };

                // Decrease button
                const decreaseBtn = document.createElement('button');
                decreaseBtn.textContent = '-';
                decreaseBtn.className = 'action-btn action-btn-subtract';
                decreaseBtn.onclick = (event) => {
                    event.stopPropagation();
                    changeTicketCount(agent, -1);
                };

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Remove';
                deleteBtn.className = 'action-btn action-btn-delete';
                deleteBtn.onclick = (event) => {
                    event.stopPropagation();
                    deleteAgent(agent);
                };

                actionCell.appendChild(increaseBtn);
                actionCell.appendChild(decreaseBtn);
                actionCell.appendChild(deleteBtn);

                row.appendChild(agentCell);
                row.appendChild(timingCell);
                row.appendChild(countCell);
                row.appendChild(actionCell);
                tableBody.appendChild(row);
            }

            // Update total count
            document.getElementById('totalCount').textContent = totalCount;

            // Adjust container height based on number of agents
            const container = document.querySelector('.container');
            if (Object.keys(agents).length >= maxAgents) {
                container.style.height = 'calc(100vh - 200px)';
                container.style.overflowY = 'auto';
            } else {
                container.style.height = 'auto';
                container.style.overflowY = 'visible';
            }
        }

        /**
         * Adds a new agent to the agents list and updates the table.
         */
        function addAgent() {
            if (Object.keys(agents).length >= 10) {
                document.getElementById('warning').style.display = 'block';
                return;
            }

            const agentName = document.getElementById('agent').value.trim();
            if (agentName && !agents[agentName]) {
                agents[agentName] = {
                    timing: '',
                    count: 0
                };
                updateTable();
            }

            document.getElementById('agent').value = '';
            document.getElementById('warning').style.display = 'none';
        }

        /**
         * Changes the ticket count for a specific agent.
         * @param {string} agent - The agent's name.
         * @param {number} change - The change in count (positive or negative).
         */
        function changeTicketCount(agent, change) {
            if (agents[agent].count + change >= 0) {
                agents[agent].count += change;
                updateTable();
            }
        }

        /**
         * Deletes a specific agent from the agents list.
         * @param {string} agent - The agent's name.
         */
        function deleteAgent(agent) {
            if (confirm(`Are you sure you want to delete ${agent}?`)) {
                delete agents[agent];
                updateTable();
            }
        }

        let isDarkMode = localStorage.getItem('darkMode') === 'true'; /* Check dark mode status */

        /**
         * Toggles dark mode on or off.
         * @param {Event} event - The click event.
         */
        function toggleDarkMode(event) {
            event.stopPropagation();
            const body = document.body;
            body.classList.toggle('dark-mode');
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);

            const toggleBtn = document.getElementById('toggleDarkModeBtn');
            toggleBtn.textContent = isDarkMode ? 'Dark' : 'Light';
        }

        /**
         * Exports the current data to an Excel file (CSV format).
         * @param {Event} event - The click event.
         */
        function exportToExcel(event) {
            event.stopPropagation();

            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            const now = new Date();
            const formattedDate = formatDate(now);

            const rows = [['Agent', 'Timing', 'Count']];

            for (const [agent, data] of Object.entries(agents)) {
                rows.push([agent, data.timing, data.count]);
            }

            const csvContent = rows.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${formattedDate}_Ticket_Assignment.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /**
         * Sets the current date and time in the specified format.
         */
        function setCurrentDateTime() {
            const now = new Date();
            const date = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            document.getElementById('currentDateTime').textContent = `${date}, ${time}`;
        }

        setCurrentDateTime(); /* Initialize date and time display */
        setInterval(setCurrentDateTime, 1000); /* Update date and time every second */