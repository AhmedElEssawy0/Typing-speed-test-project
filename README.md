# Typing Speed Test Game

## Project Overview

The **Typing Speed Test Game** is a web-based application designed to help users improve their typing speed and accuracy. The game presents words at different difficulty levels and measures how quickly and accurately users can type them within a time limit.

## Project Features

### Core Features
- **Multiple Difficulty Levels**: Easy (5 seconds), Normal (3 seconds), Hard (2 seconds)
- **Dynamic Word Lists**: Different word sets for each difficulty level
- **Real-time Scoring**: Live score tracking during gameplay
- **Score History**: Local storage of game scores with timestamps
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Input Validation**: Client-side and server-side validation using regex patterns
- **AJAX Integration**: Asynchronous communication with server for score persistence
- **Database Integration**: MySQL database for storing and retrieving scores

### Technical Features
- **XHTML 1.0 Strict Compliance**: Properly structured and validated markup
- **Separation of Concerns**: HTML, CSS, and JavaScript are completely separated
- **Responsive CSS**: Mobile-first design with media queries for all screen sizes
- **Modular JavaScript**: Well-organized functions with clear purposes
- **DOM Manipulation**: Dynamic element creation and manipulation
- **Event Handling**: Unobtrusive JavaScript with event listeners
- **Local Storage**: Browser-based score persistence
- **Server-side Processing**: PHP backend for data validation and storage

## Project Structure

```
TypingSpeedWebsite_Complete/
├── index.html              # Main HTML markup (XHTML 1.0 Strict)
├── main.css                # Stylesheet with responsive design
├── main.js                 # JavaScript game logic and functionality
├── save_score.php          # PHP backend for saving scores
├── get_scores.php          # PHP backend for retrieving scores
├── database_setup.sql      # Database schema and initialization
├── README.md               # This file
└── DOCUMENTATION.md        # Detailed technical documentation
```

## Technology Stack

### Frontend
- **HTML**: XHTML 1.0 Strict for semantic markup
- **CSS**: CSS3 with responsive design and animations
- **JavaScript**: ES6+ for game logic and interactivity
- **Local Storage API**: For client-side score persistence

### Backend
- **PHP 7+**: Server-side processing and validation
- **MySQL**: Relational database for score storage
- **AJAX**: Asynchronous data communication

### Development Tools
- **Text Editor**: Any modern code editor (VS Code, Sublime, etc.)
- **Web Server**: Apache or Nginx with PHP support
- **Database**: MySQL 5.7+ or MariaDB

## Installation and Setup

### Prerequisites
- Web server with PHP 7+ support (Apache/Nginx)
- MySQL 5.7+ or MariaDB
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Database Setup
1. Open your MySQL client or phpMyAdmin
2. Execute the SQL script from `database_setup.sql`:
   ```sql
   SOURCE database_setup.sql;
   ```
3. Verify the database and tables are created:
   ```sql
   USE typing_game_db;
   SHOW TABLES;
   ```

### Step 2: File Deployment
1. Copy all project files to your web server's document root:
   - Linux/Mac: `/var/www/html/` or similar
   - Windows: `C:\xampp\htdocs\` (for XAMPP)

2. Ensure proper file permissions:
   ```bash
   chmod 755 *.php
   chmod 644 *.html *.css *.js
   ```

### Step 3: Configuration
1. Update database credentials in `save_score.php` and `get_scores.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'typing_game_db');
   ```

### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost/TypingSpeedWebsite_Complete/index.html
```

## Usage Guide

### Starting a Game
1. Select your desired difficulty level from the dropdown
2. Click the "Start Playing" button
3. The game will display a word in the center
4. Type the word in the input field
5. Press Enter or wait for the timer to expire

### Game Rules
- You must type the exact word (case-insensitive)
- You have a limited time based on difficulty level
- Correct answers increase your score
- Wrong answers or timeout ends the game
- Your score is automatically saved to local storage

### Viewing Score History
1. Click the "View Score History" button
2. A modal will display all your previous scores
3. Scores show level, score, percentage, and date/time
4. Click "Clear History" to delete all scores (with confirmation)

### Difficulty Levels
- **Easy**: 5 seconds per word, simpler vocabulary
- **Normal**: 3 seconds per word, mixed vocabulary
- **Hard**: 2 seconds per word, complex vocabulary

## Code Structure and Organization

### HTML (index.html)
- Semantic XHTML 1.0 Strict markup
- Proper use of meta tags and accessibility attributes
- Separated content from presentation
- Modal dialogs for history and validation messages

### CSS (main.css)
- CSS variables for consistent theming
- Responsive design with mobile-first approach
- Flexbox and Grid layouts
- Smooth transitions and animations
- Print-friendly styles

### JavaScript (main.js)
- Modular function organization
- Clear separation of concerns
- Comprehensive comments and documentation
- Event-driven architecture
- Local Storage API integration
- AJAX communication setup

### PHP Backend
- **save_score.php**: Validates and saves scores to database
- **get_scores.php**: Retrieves scores with filtering options
- Input validation and sanitization
- Error handling and JSON responses
- Database connection management

## Validation Implementation

### Client-Side Validation (JavaScript)
```javascript
// Regex pattern for alphabetic characters only
const alphabeticPattern = /^[a-zA-Z]+$/;

// Validates input length, characters, and format
function validateInput(input) {
    // Check empty, alphabetic, and length constraints
}
```

### Server-Side Validation (PHP)
```php
// Validates score data before database insertion
function validateScoreData($data) {
    // Check required fields
    // Validate data types and ranges
    // Ensure score <= total
}
```

## AJAX Implementation

### Sending Scores to Server
```javascript
function sendScoreToServer(scoreData) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "save_score.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(scoreData));
}
```

### Retrieving Scores from Server
```javascript
function retrieveScoresFromServer() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "get_scores.php", true);
    xhr.send();
}
```

## Database Schema

### Scores Table
```sql
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    percentage INT NOT NULL,
    date_played DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- One-to-Many relationship between users and scores (optional)
- Indexes on frequently queried columns (level, date)
- Constraints for data integrity

## Features Compliance with Requirements

### ✅ XHTML
- [x] Code readability and organization
- [x] Well-formed XHTML syntax
- [x] W3C validation compliance
- [x] Separation of content from presentation

### ✅ CSS
- [x] Separation from HTML
- [x] External CSS files
- [x] Responsive design
- [x] Multiple selectors (class, id, element, combinators)

### ✅ Floating Layout
- [x] CSS floats for layout
- [x] Float clearing techniques
- [x] Flexbox alternative layouts

### ✅ JavaScript
- [x] Function declarations and invocations
- [x] Parameters and return values
- [x] Separation of behavior from HTML
- [x] Code modularity and reusability

### ✅ DOM Manipulation
- [x] Element selection and manipulation
- [x] Dynamic attribute and content changes
- [x] Element creation and removal
- [x] Event handling and delegation

### ✅ Unobtrusive JavaScript
- [x] No inline event handlers
- [x] Event listeners in separate file
- [x] Clean HTML markup

### ✅ Validation
- [x] Client-side validation with regex
- [x] Server-side validation
- [x] User-friendly error messages

### ✅ AJAX
- [x] XML/JSON data interchange
- [x] XMLHttpRequest usage
- [x] Asynchronous communication

### ✅ Server-Side (PHP)
- [x] Form processing
- [x] Data validation
- [x] Database operations

### ✅ Database
- [x] Relational database design
- [x] Proper schema with constraints
- [x] Data integrity measures

### ✅ Functionality
- [x] All features working correctly
- [x] Intuitive user interface
- [x] Responsive across devices

### ✅ UX/Design
- [x] User-friendly interface
- [x] Aesthetic design
- [x] Responsive layout
- [x] Cross-browser compatibility

### ✅ Documentation
- [x] Well-written documentation
- [x] Requirements and UML diagrams
- [x] Stakeholder information
- [x] Function and non-function requirements

## Browser Compatibility

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

## Performance Optimization

- Minified CSS and JavaScript (optional)
- Lazy loading for images (if added)
- Efficient DOM queries with caching
- Debounced event handlers
- Optimized database queries with indexes

## Security Considerations

- Input sanitization on server-side
- SQL injection prevention with prepared statements
- XSS protection with HTML encoding
- CSRF token implementation (recommended)
- HTTPS enforcement (recommended for production)

## Future Enhancements

1. **User Authentication**: Login/registration system
2. **Leaderboards**: Global and friend rankings
3. **Statistics Dashboard**: Detailed performance analytics
4. **Sound Effects**: Audio feedback for correct/incorrect answers
5. **Multiplayer Mode**: Real-time competitive gameplay
6. **Mobile App**: Native iOS/Android applications
7. **API Integration**: RESTful API for third-party integration
8. **Achievements**: Badge and achievement system
9. **Themes**: Dark mode and custom themes
10. **Accessibility**: Enhanced WCAG 2.1 compliance

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in PHP files
- Ensure database exists

### Scores Not Saving
- Check PHP error logs
- Verify database table structure
- Test AJAX requests in browser console

### Styling Issues
- Clear browser cache
- Check CSS file path
- Verify media queries for your device

### JavaScript Errors
- Open browser developer console (F12)
- Check for syntax errors
- Verify DOM elements exist before manipulation

## Support and Contact

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all files are properly deployed
4. Contact the development team

## License

This project is provided as-is for educational purposes.

## Version History

- **v1.0** (Dec 2025): Initial release with core features
  - Multiple difficulty levels
  - Score tracking
  - Responsive design
  - Database integration
  - AJAX functionality

---

**Last Updated**: December 29, 2025
**Project Status**: Complete and Production-Ready
