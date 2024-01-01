const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        header {
            background-color: #333;
            color: #fff;
            padding: 10px;
            text-align: center;
        }

        section {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .user-card {
            border: 1px solid #ddd;
            padding: 20px;
            margin-top: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        button {
            background-color: #333;
            color: #fff;
            border: none;
            padding: 10px;
            cursor: pointer;
        }

        button:hover {
            background-color: #555;
        }

        form {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
        }

        label {
            margin-bottom: 8px;
            font-weight: bold;
        }

        input {
            padding: 8px;
            margin-bottom: 16px;
        }

    </style>
</head>
<body>

    <header>
        <h1>User Management</h1>
    </header>

    <section>
        <h2>All Users</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Job Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="usersTableBody"></tbody>
        </table>
    </section>

    <section>
        <h2>User Details</h2>
        <div id="userDetails" class="user-card"></div>
    </section>

    <section>
        <h2>Create New User</h2>
        <form id="createUserForm" method="POST" action="http://localhost:5000/api/users">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="first_name" required>

            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="last_name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="gender">Gender:</label>
            <select id="gender" name="gender" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>

            <label for="jobTitle">Job Title:</label>
            <input type="text" id="jobTitle" name="job_title" required>

            <button type="submit">Create User</button>
        </form>
    </section>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            // Fetch all users and render the table
            fetch('/api/users')
                .then(response => response.json())
                .then(users => renderUsersTable(users));


            // Helper function to render the users table
            function renderUsersTable(users) {
                const tableBody = document.getElementById('usersTableBody');
                tableBody.innerHTML = '';

                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = \`
                        <td>\${user.id}</td>
                        <td>\${user.first_name}</td>
                        <td>\${user.last_name}</td>
                        <td>\${user.email}</td>
                        <td>\${user.gender}</td>
                        <td>\${user.job_title}</td>
                        <td>
                            <button onclick="showUserDetails(\${user.id})">View</button>
                            <button onclick="deleteUser(\${user.id})">Delete</button>
                        </td>
                    \`;
                    tableBody.appendChild(row);
                });
            }

            // Helper function to show user details
            window.showUserDetails = function (userId) {
                fetch(\`/api/users/\${userId}\`)
                    .then(response => response.json())
                    .then(user => {
                        const userDetails = document.getElementById('userDetails');
                        userDetails.innerHTML = \`
                            <h3>\${user.first_name} \${user.last_name}</h3>
                            <p>Email: \${user.email}</p>
                            <p>Gender: \${user.gender}</p>
                            <p>Job Title: \${user.job_title}</p>
                        \`;
                    })
                    .catch(error => console.error('Error fetching user details:', error));
            };

            // Helper function to delete a user
            window.deleteUser = function (userId) {
                if (confirm('Are you sure you want to delete this user?')) {
                    fetch(\`/api/users/\${userId}\`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.msg);
                            // Refresh the user table after deleting a user
                            fetch('/api/users')
                                .then(response => response.json())
                                .then(users => renderUsersTable(users));
                        })
                        .catch(error => console.error('Error deleting user:', error));
                }
            };
        });
    </script>

</body>
</html>
`;

export default htmlContent;
