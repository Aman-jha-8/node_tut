import { express , User } from "../expressandUserPackage.js";

const getUser = async (req, res) => {
    try {
        const allDbUsers = await User.find({});
        const html = `
            <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
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
            </style>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Job Title</th>
                    </tr>
                </thead>
                <tbody>
                    ${allDbUsers.map((user) => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>${user.gender}</td>
                            <td>${user.job_title}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const getUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const html = `
            <html>
            <head>
                <style>
                    body {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f4f4f4;
                        font-family: 'Arial', sans-serif;
                    }

                    .user-card {
                        border: 1px solid #ddd;
                        padding: 20px;
                        width: 300px;
                        background-color: #fff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }

                    h3 {
                        margin: 0;
                        color: #333;
                    }

                    p {
                        margin: 10px 0 0;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="user-card">
                    <h3>${user.first_name} ${user.last_name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Gender: ${user.gender}</p>
                    <p>Job Title: ${user.job_title}</p>
                </div>
            </body>
            </html>`;

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export {
    getUserId,
    getUser
}
