const ePub = require('epub-gen');
const fs = require('fs-extra');
const moment = require('moment');

// Ensure output directory exists
fs.ensureDirSync('./output');

// Get version from environment or generate
const versionType = process.env.VERSION_TYPE || 'patch';
let currentVersion = '1.0.0';

// Try to read existing version
try {
  if (fs.existsSync('version.txt')) {
    currentVersion = fs.readFileSync('version.txt', 'utf-8').trim();
    currentVersion = incrementVersion(currentVersion, versionType);
  }
} catch (e) {
  console.log('No existing version found, starting at 1.0.0');
}

// Save new version
fs.writeFileSync('version.txt', currentVersion);

console.log(`📚 Generating Programming Cheatsheets v${currentVersion}`);

// Define all cheatsheets
const cheatsheets = {
  python: {
    title: "🐍 Python Cheatsheet",
    content: `
      <h1>Python Cheatsheet</h1>
      
      <h2>Basic Syntax</h2>
      <pre><code># Variables
name = "John"
age = 25
is_student = True

# Lists
fruits = ["apple", "banana", "orange"]
fruits.append("grape")
fruits[0]  # Access first element

# Dictionaries
person = {"name": "John", "age": 25}
person["email"] = "john@example.com"

# Conditionals
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")

# Loops
for fruit in fruits:
    print(fruit)

for i in range(5):
    print(i)

while count < 10:
    count += 1

# Functions
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# List comprehensions
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Lambda functions
multiply = lambda x, y: x * y
</code></pre>

      <h2>Common Methods</h2>
      <pre><code># Strings
text = "hello world"
text.upper()  # "HELLO WORLD"
text.split()  # ["hello", "world"]
text.replace("world", "python")
", ".join(fruits)  # "apple, banana, orange"

# Lists
numbers = [1, 2, 3, 4, 5]
sum(numbers)  # 15
max(numbers)  # 5
min(numbers)  # 1
len(numbers)  # 5
sorted(numbers, reverse=True)

# File handling
with open("file.txt", "r") as f:
    content = f.read()

with open("output.txt", "w") as f:
    f.write("Hello World")

# Error handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
finally:
    print("This always runs")
</code></pre>
    `
  },
  
  javascript: {
    title: "📜 JavaScript Cheatsheet",
    content: `
      <h1>JavaScript Cheatsheet</h1>
      
      <h2>Variables & Data Types</h2>
      <pre><code>// Variables
let name = "John";
const age = 25;
var oldWay = "avoid this";

// Data types
let string = "Hello";
let number = 42;
let boolean = true;
let array = [1, 2, 3];
let object = {key: "value"};
let nullValue = null;
let undefinedValue;

// Template literals

</code></pre>

      <h2>Functions & Arrow Functions</h2>
      <pre><code>// Regular function
function add(a, b) {
    return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;

// Function with default parameters
function greet(name = "Guest") {
    return Hello ${name}!;
}

// Rest parameters
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

// Immediately Invoked Function Expression (IIFE)
(() => {
    console.log("Runs immediately");
})();
</code></pre>

      <h2>Arrays & Objects</h2>
      <pre><code>// Array methods
const numbers = [1, 2, 3, 4, 5];
numbers.map(n => n * 2);     // [2, 4, 6, 8, 10]
numbers.filter(n => n > 2);  // [3, 4, 5]
numbers.reduce((a, b) => a + b, 0);  // 15
numbers.find(n => n > 3);    // 4
numbers.some(n => n > 4);    // true
numbers.every(n => n > 0);   // true

// Object manipulation
const person = {name: "John", age: 25};
const {name, age} = person;  // Destructuring
const updated = {...person, city: "NYC"};  // Spread operator

// Optional chaining
const result = person?.address?.city;
</code></pre>

      <h2>Promises & Async/Await</h2>
      <pre><code>// Promise
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("Data"), 1000);
    });
};

// Async/Await
async function getData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

// Promise.all
Promise.all([promise1, promise2, promise3])
    .then(results => console.log(results));
</code></pre>
    `
  },
  
  git: {
    title: "📦 Git Cheatsheet",
    content: `
      <h1>Git Cheatsheet</h1>
      
      <h2>Configuration</h2>
      <pre><code>git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --list  # View all configs
</code></pre>

      <h2>Starting a Repository</h2>
      <pre><code>git init                    # Initialize new repo
git clone <url>             # Clone existing repo
git remote add origin <url> # Add remote
</code></pre>

      <h2>Basic Commands</h2>
      <pre><code>git status                  # Check status
git add <file>              # Stage file
git add .                   # Stage all files
git commit -m "message"     # Commit changes
git push origin main        # Push to remote
git pull origin main        # Pull from remote
git fetch origin            # Fetch without merging
</code></pre>

      <h2>Branching & Merging</h2>
      <pre><code>git branch                  # List branches
git branch <name>           # Create branch
git checkout <branch>       # Switch branch
git checkout -b <branch>    # Create and switch
git merge <branch>          # Merge branch
git branch -d <branch>      # Delete branch
git push origin --delete <branch>  # Delete remote branch
</code></pre>

      <h2>Undoing Changes</h2>
      <pre><code>git reset HEAD <file>        # Unstage file
git checkout -- <file>       # Discard changes
git reset --soft HEAD~1      # Undo commit (keep changes)
git reset --hard HEAD~1      # Undo commit (discard changes)
git revert <commit>          # Create inverse commit
</code></pre>

      <h2>Stashing</h2>
      <pre><code>git stash                   # Save changes
git stash list              # List stashes
git stash pop               # Apply and remove stash
git stash apply             # Apply but keep stash
git stash drop              # Remove stash
</code></pre>
    `
  },
  
  sql: {
    title: "🗄️ SQL Cheatsheet",
    content: `
      <h1>SQL Cheatsheet</h1>
      
      <h2>Basic Queries</h2>
      <pre><code>-- Select data
SELECT * FROM users;
SELECT name, email FROM users WHERE age > 18;
SELECT DISTINCT city FROM users;

-- Insert data
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');

-- Update data
UPDATE users SET age = 26 WHERE name = 'John';

-- Delete data
DELETE FROM users WHERE id = 5;
</code></pre>

      <h2>Joins</h2>
      <pre><code>-- Inner Join
SELECT * FROM orders
INNER JOIN users ON orders.user_id = users.id;

-- Left Join
SELECT * FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Right Join
SELECT * FROM orders
RIGHT JOIN users ON orders.user_id = users.id;

-- Full Outer Join
SELECT * FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
</code></pre>

      <h2>Aggregation</h2>
      <pre><code>SELECT 
    COUNT(*) as total_users,
    AVG(age) as average_age,
    MAX(age) as oldest,
    MIN(age) as youngest,
    SUM(salary) as total_salary
FROM users
GROUP BY department
HAVING COUNT(*) > 5;
</code></pre>

      <h2>Advanced</h2>
      <pre><code>-- Subquery
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);

-- Window function
SELECT name, salary,
    RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- Common Table Expression (CTE)
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 50000
)
SELECT * FROM high_earners;
</code></pre>
    `
  },
  
  docker: {
    title: "🐳 Docker Cheatsheet",
    content: `
      <h1>Docker Cheatsheet</h1>
      
      <h2>Container Management</h2>
      <pre><code>docker run -d --name myapp nginx     # Run container in background
docker ps                              # List running containers
docker ps -a                           # List all containers
docker stop myapp                      # Stop container
docker start myapp                     # Start container
docker restart myapp                   # Restart container
docker rm myapp                        # Remove container
docker rm $(docker ps -aq)            # Remove all containers
</code></pre>

      <h2>Image Management</h2>
      <pre><code>docker images                          # List images
docker pull ubuntu:latest              # Pull image
docker build -t myapp:1.0 .           # Build image
docker tag myapp:1.0 myapp:latest      # Tag image
docker push myrepo/myapp:latest        # Push to registry
docker rmi myapp:1.0                   # Remove image
</code></pre>

      <h2>Dockerfile Example</h2>
      <pre><code># Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
</code></pre>

      <h2>Docker Compose</h2>
      <pre><code># docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
</code></pre>

      <h2>Useful Commands</h2>
      <pre><code>docker exec -it myapp /bin/bash       # Enter container
docker logs myapp                      # View logs
docker logs -f myapp                   # Follow logs
docker inspect myapp                   # Container details
docker stats                           # Resource usage
docker system prune -a                 # Clean up unused
</code></pre>
    `
  },
  
  bash: {
    title: "🐚 Bash Cheatsheet",
    content: `
      <h1>Bash Cheatsheet</h1>
      
      <h2>File Operations</h2>
      <pre><code>ls -la                                 # List all files
cd /path/to/dir                        # Change directory
pwd                                    # Print working directory
cp source dest                         # Copy file
mv source dest                         # Move/rename
rm file.txt                            # Remove file
rm -rf directory/                      # Remove directory recursively
mkdir newdir                           # Create directory
touch file.txt                         # Create empty file
</code></pre>

      <h2>Text Processing</h2>
      <pre><code>cat file.txt                           # View file
head -n 10 file.txt                    # First 10 lines
tail -n 10 file.txt                    # Last 10 lines
grep "pattern" file.txt                # Search for pattern
grep -r "pattern" ./                   # Recursive search
sed 's/old/new/g' file.txt             # Replace text
awk '{print $1}' file.txt              # Print first column
</code></pre>

      <h2>Permissions</h2>
      <pre><code>chmod 755 file.sh                      # rwxr-xr-x
chmod +x file.sh                        # Make executable
chown user:group file.txt               # Change owner
</code></pre>

      <h2>Variables & Loops</h2>
      <pre><code>#!/bin/bash
# Variables
name="World"
echo "Hello $name"

# For loop
for i in {1..5}; do
    echo "Number $i"
done

# While loop
count=1
while [ $count -le 5 ]; do
    echo $count
    ((count++))
done

# If statement
if [ -f "file.txt" ]; then
    echo "File exists"
elif [ -d "directory" ]; then
    echo "Directory exists"
else
    echo "Not found"
fi
</code></pre>
    `
  }
};

// Select which cheatsheets to include
let selectedCheatsheets = Object.values(cheatsheets);
const languagesFilter = process.env.LANGUAGES || 'all';

if (languagesFilter !== 'all') {
  const languages = languagesFilter.split(',');
  selectedCheatsheets = selectedCheatsheets.filter(cheat => 
    languages.some(lang => cheat.title.toLowerCase().includes(lang))
  );
}

console.log(`Including ${selectedCheatsheets.length} cheatsheets`);

// Build the content
const content = [
  {
    title: "Introduction",
    data: `
      <div style="text-align: center;">
        <h1>📚 Programming Cheatsheets Collection</h1>
        <p><strong>Version ${currentVersion}</strong></p>
        <p>Generated on ${moment().format('MMMM Do YYYY, h:mm:ss a')}</p>
        <p>Your ultimate reference for programming languages and tools!</p>
        <hr/>
        <h2>Table of Contents</h2>
        ${selectedCheatsheets.map((sheet, idx) => 
          `<p><a href="#section-${idx}">${sheet.title}</a></p>`
        ).join('')}
      </div>
    `
  },
  ...selectedCheatsheets.map((sheet, idx) => ({
    title: sheet.title,
    data: `<div id="section-${idx}">${sheet.content}</div>`
  })),
  {
    title: "Quick Reference Cards",
    data: `
      <h1>⚡ Quick Reference</h1>
      
      <h2>Common Programming Patterns</h2>
      <table border="1" cellpadding="10" style="border-collapse: collapse;">
        <tr>
          <th>Task</th>
          <th>Python</th>
          <th>JavaScript</th>
        </tr>
        <tr>
          <td>List/Array iteration</td>
          <td><code>for item in list:</code></td>
          <td><code>array.forEach(item => )</code></td>
        </tr>
        <tr>
          <td>Map/Transform</td>
          <td><code>map(func, list)</code></td>
          <td><code>array.map(x => x*2)</code></td>
        </tr>
        <tr>
          <td>Filter</td>
          <td><code>filter(func, list)</code></td>
          <td><code>array.filter(x => x>5)</code></td>
        </tr>
        <tr>
          <td>Reduce/Sum</td>
          <td><code>sum(list)</code></td>
          <td><code>array.reduce((a,b)=>a+b,0)</code></td>
        </tr>
      </table>
      
      <h2>Keyboard Shortcuts (VS Code)</h2>
      <ul>
        <li><strong>Ctrl+P</strong> - Quick file open</li>
        <li><strong>Ctrl+Shift+P</strong> - Command palette</li>
        <li><strong>Ctrl+Shift+F</strong> - Find in files</li>
        <li><strong>Ctrl+Shift+L</strong> - Select all occurrences</li>
        <li><strong>Alt+Up/Down</strong> - Move line</li>
        <li><strong>Ctrl+D</strong> - Add selection to next match</li>
        <li><strong>Ctrl+/</strong> - Toggle line comment</li>
        <li><strong>F5</strong> - Start debugging</li>
      </ul>
    `
  }
];

// Generate the EPUB
const options = {
  title: `Programming Cheatsheets v${currentVersion}`,
  author: "GitHub Actions Auto-Generator",
  publisher: "Open Source Community",
  description: "A comprehensive collection of programming cheatsheets including Python, JavaScript, Git, SQL, Docker, and more.",
  cover: null,  // You can add a cover image URL here
  output: `./output/Programming-Cheatsheets-${currentVersion}.epub`,
  version: 3,
  lang: "en",
  css: `
    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      margin: 2em;
      color: #333;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 0.3em;
      margin-top: 1em;
    }
    h2 {
      color: #34495e;
      border-left: 4px solid #3498db;
      padding-left: 0.5em;
      margin-top: 1.5em;
    }
    pre {
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 1em;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    code {
      background-color: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    table {
      width: 100%;
      margin: 1em 0;
    }
    th {
      background-color: #3498db;
      color: white;
      padding: 0.5em;
    }
    td {
      padding: 0.5em;
      border: 1px solid #ddd;
    }
    .issue {
      margin: 1em 0;
      padding: 1em;
      background-color: #f9f9f9;
      border-left: 4px solid #3498db;
    }
  `,
  content: content
};

console.log("📖 Generating EPUB...");

new ePub(options, (err) => {
  if (err) {
    console.error("❌ Error generating EPUB:", err);
    process.exit(1);
  }
  
  console.log(`✅ EPUB generated successfully!`);
  console.log(`📚 File: Programming-Cheatsheets-${currentVersion}.epub`);
  console.log(`📏 Size: ${fs.statSync(`./output/Programming-Cheatsheets-${currentVersion}.epub`).size / 1024} KB`);
});

// Helper function to increment version
function incrementVersion(version, type) {
  const parts = version.split('.').map(Number);
  
  switch(type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}
