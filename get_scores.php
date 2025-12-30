<?php
/**
 * Typing Speed Game - Get Scores Handler
 * 
 * This script retrieves game scores from the database
 * Returns JSON data with optional filtering
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set response header to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'typing_game_db');

/**
 * Retrieves scores from database with optional filtering
 * @param mysqli $conn Database connection
 * @param string $level Optional level filter
 * @param int $limit Maximum number of records to return
 * @return array Scores array
 */
function getScoresFromDB($conn, $level = null, $limit = 50) {
    $query = "SELECT id, level, score, total, percentage, date_played 
              FROM scores";

    if ($level) {
        $validLevels = array('Easy', 'Normal', 'Hard');
        if (in_array($level, $validLevels)) {
            $level = $conn->real_escape_string($level);
            $query .= " WHERE level = '$level'";
        }
    }

    $query .= " ORDER BY date_played DESC LIMIT " . intval($limit);

    $result = $conn->query($query);

    if (!$result) {
        return array(
            'success' => false,
            'message' => 'Query failed: ' . $conn->error,
            'scores' => array()
        );
    }

    $scores = array();
    while ($row = $result->fetch_assoc()) {
        $scores[] = array(
            'id' => intval($row['id']),
            'level' => $row['level'],
            'score' => intval($row['score']),
            'total' => intval($row['total']),
            'percentage' => intval($row['percentage']),
            'date' => $row['date_played']
        );
    }

    return array(
        'success' => true,
        'message' => 'Scores retrieved successfully',
        'count' => count($scores),
        'scores' => $scores
    );
}

/**
 * Retrieves score statistics
 * @param mysqli $conn Database connection
 * @return array Statistics array
 */
function getScoreStatistics($conn) {
    $query = "SELECT 
                level,
                COUNT(*) as total_games,
                AVG(score) as avg_score,
                AVG(percentage) as avg_percentage,
                MAX(score) as max_score,
                MIN(score) as min_score
              FROM scores
              GROUP BY level
              ORDER BY level";

    $result = $conn->query($query);

    if (!$result) {
        return array();
    }

    $stats = array();
    while ($row = $result->fetch_assoc()) {
        $stats[] = array(
            'level' => $row['level'],
            'total_games' => intval($row['total_games']),
            'avg_score' => round(floatval($row['avg_score']), 2),
            'avg_percentage' => round(floatval($row['avg_percentage']), 2),
            'max_score' => intval($row['max_score']),
            'min_score' => intval($row['min_score'])
        );
    }

    return $stats;
}

// Main execution
try {
    // Check if request method is GET
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(array(
            'success' => false,
            'message' => 'Method not allowed. Use GET.'
        ));
        exit;
    }

    // Get query parameters
    $level = isset($_GET['level']) ? sanitize_input($_GET['level']) : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $stats = isset($_GET['stats']) ? $_GET['stats'] === 'true' : false;

    // Validate limit
    if ($limit < 1 || $limit > 1000) {
        $limit = 50;
    }

    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(array(
            'success' => false,
            'message' => 'Database connection failed: ' . $conn->connect_error
        ));
        exit;
    }

    // Set charset
    $conn->set_charset('utf8mb4');

    // Get scores
    $response = getScoresFromDB($conn, $level, $limit);

    // Get statistics if requested
    if ($stats) {
        $response['statistics'] = getScoreStatistics($conn);
    }

    // Close connection
    $conn->close();

    // Return response
    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ));
}

/**
 * Sanitizes input data
 * @param mixed $data The data to sanitize
 * @return mixed Sanitized data
 */
function sanitize_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>
