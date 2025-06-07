# Expense Tracker - Notes

### 1. What is SSL and how does it work exactly?

SSL (Secure Sockets Layer) is a security protocol that encrypts data transferred between a client (browser) and a server to keep it private and secure. It uses a handshake process where the server and client exchange encryption keys to create a secure connection.

---

### 2. How does Heroku exactly work?

Heroku is a cloud platform where you deploy your app by pushing your code via Git. It automatically builds and runs your app inside containers called Dynos, providing a live URL to access it without managing servers.

---

### 3. Why is Git called a version controller?

Git is called a version controller because it keeps track of every change made to the code over time, allowing you to revert to previous versions and collaborate safely with others.

---

### 4. What is commit, branch, and remote?

- **Commit:** A saved snapshot of your project at a specific time.  
- **Branch:** A separate version of your code for working on features without affecting the main code.  
- **Remote:** A repository hosted elsewhere (like GitHub or Heroku) to sync your local code.

---

### 5. What does `.gitignore` file do? Why is it important?

`.gitignore` tells Git which files or folders to ignore so they are not tracked or pushed. This prevents large or sensitive files (like `node_modules` or `.env`) from being included in your repository.

---

### 6. Why don't we push `node_modules` to Git?

Because `node_modules` contains thousands of files specific to your environment and can be very large. Instead, we use `package.json` to list dependencies and reinstall them with `npm install`.

---

### 7. What happens when we restart the server?

When the server restarts, all in-memory data is lost, the app reloads fresh, and any persistent data must be saved in a database to survive the restart.
