<?php
/**
 * Typing Speed Game - Save Score Handler
 * 
 * This script handles saving game scores to the database
 * Receives JSON data via POST request and validates before saving
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set response header to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'typing_game_db');

/**
 * Validates the input data
 * @param array $data The data to validate
 * @return array Validation result
 */
function validateScoreData($data) {
    $errors = array();

    // Check required fields
    if (empty($data['level'])) {
        $errors[] = "Level is required";
    } else {
        $validLevels = array('Easy', 'Normal', 'Hard');
        if (!in_array($data['level'], $validLevels)) {
            $errors[] = "Invalid level";
        }
    }

    if (!isset($data['score']) || !is_numeric($data['score'])) {
        $errors[] = "Score must be a number";
    } elseif ($data['score'] < 0) {
        $errors[] = "Score cannot be negative";
    }

    if (!isset($data['total']) || !is_numeric($data['total'])) {
        $errors[] = "Total must be a number";
    } elseif ($data['total'] <= 0) {
        $errors[] = "Total must be greater than 0";
    }

    if (isset($data['score']) && isset($data['total'])) {
        if ($data['score'] > $data['total']) {
            $errors[] = "Score cannot be greater than total";
        }
    }

    if (isset($data['percentage']) && !is_numeric($data['percentage'])) {
        $errors[] = "Percentage must be a number";
    }

    return array(
        'valid' => count($errors) === 0,
        'errors' => $errors
    );
}

/**
 * Sanitizes input data
 * @param mixed $data The data to sanitize
 * @return mixed Sanitized data
 */
function sanitizeData($data) {
    if (is_array($data)) {
        return array_map('sanitizeData', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Saves score to database
 * @param mysqli $conn Database connection
 * @param array $data Score data
 * @return array Result array
 */
function saveScoreToDB($conn, $data) {
    $level = $conn->real_escape_string($data['level']);
    $score = intval($data['score']);
    $total = intval($data['total']);
    $percentage = isset($data['percentage']) ? intval($data['percentage']) : 0;
    $date = date('Y-m-d H:i:s');

    $query = "INSERT INTO scores (level, score, total, percentage, date_played) 
              VALUES ('$level', $score, $total, $percentage, '$date')";

    if ($conn->query($query) === TRUE) {
        return array(
            'success' => true,
            'message' => 'Score saved successfully',
            'id' => $conn->insert_id
        );
    } else {
        return array(
            'success' => false,
            'message' => 'Error saving score: ' . $conn->error
        );
    }
}

// Main execution
try {
    // Check if request method is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(array(
            'success' => false,
            'message' => 'Method not allowed. Use POST.'
        ));
        exit;
    }

    // Get raw POST data
    $rawData = file_get_contents('php://input');

    // Decode JSON
    $data = json_decode($rawData, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode(array(
            'success' => false,
            'message' => 'Invalid JSON data'
        ));
        exit;
    }

    // Sanitize data
    $data = sanitizeData($data);

    // Validate data
    $validation = validateScoreData($data);

    if (!$validation['valid']) {
        http_response_code(400);
        echo json_encode(array(
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validation['errors']
        ));
        exit;
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

    // Save score to database
    $result = saveScoreToDB($conn, $data);

    // Close connection
    $conn->close();

    // Return response
    if ($result['success']) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ));
}
?>
