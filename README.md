# Real-time Code Editor with Compiler

A **real-time collaborative code editor** with live compilation support built using **React, Socket.IO, Node.js, and Express**. Users can join rooms, edit code together, change programming languages, and compile code online.

**Live Demo:** [https://real-time-code-editor-00mi.onrender.com/](https://real-time-code-editor-00mi.onrender.com/)

---

## Features

- Real-time collaborative editing with multiple users
- Live cursor & typing indicators
- Multiple language support: JavaScript, Python, C++, Java, C#, Ruby, Go
- Online code compilation using [Piston API](https://emkc.org/api/v2/piston/)
- Room-based collaboration
- Copy room ID to invite others

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Anmolkr-1885/Real-time-Code-Editor.git
cd Real-time-Code-Editor

# 2. Install dependencies
npm install
cd frontend
npm install

# 3. Build frontend
npm run build

# 4. Run the application
npm run dev
