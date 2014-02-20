<?php

$DATA_DIR = dirname(__FILE__) . '/data';
date_default_timezone_set('CET');

function writeFile($file, $data) {
    $result = file_put_contents($file, $data);
    if (!$result) {
        http_response_code(500);
        echo "error while writing storing";
        exit;
    }
}

function full_url($s)
{
    $ssl = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on') ? true:false;
    $sp = strtolower($s['SERVER_PROTOCOL']);
    $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
    $port = $s['SERVER_PORT'];
    $port = ((!$ssl && $port=='80') || ($ssl && $port=='443')) ? '' : ':'.$port;
    $host = isset($s['HTTP_X_FORWARDED_HOST']) ? $s['HTTP_X_FORWARDED_HOST'] : isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : $s['SERVER_NAME'];
    return $protocol . '://' . $host . $port . $s['REQUEST_URI'];
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') { // new
    $json_input = file_get_contents("php://input");
    $survey = json_decode($json_input);
    
    $survey->date = date('Y-m-d H:i:s');
    $filename = $survey->customer
        .'_'. $survey->projectName
        .'_'. $survey->date;
    $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $filename);
    $survey->surveyURI = full_url($_SERVER) . "?surveyid=$filename";

    writeFile($DATA_DIR . '/' . $filename, json_encode($survey));
    http_response_code(201);
    header('Location: '. $survey->surveyURI);

    exit;
}

if ($_GET['surveyid']) { // PUT or GET one survey
    $filename = $_GET['surveyid'];
    $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $filename);
    $fullPath = $DATA_DIR . '/' . $filename;

    if (!file_exists($fullPath)) {
        http_response_code(404);
        exit;
    }
    
    if ($_SERVER['REQUEST_METHOD'] == 'PUT') { // new
        writeFile($fullPath, file_get_contents("php://input"));
    } 
    
    Header('Content-type: application/json');
    echo file_get_contents($fullPath);

    exit;
}


// else: return all surveys
$files = [];
foreach (new DirectoryIterator($DATA_DIR) as $fileinfo) {
    if (!$fileinfo->isDot()) {
        $files[] =  $fileinfo->getFilename();
    }
}

echo "[\n";
$cit = new CachingIterator(new ArrayIterator($files));
foreach ($cit as $file) {
    echo file_get_contents($DATA_DIR .'/'. $file);
    if ($cit->hasNext()) {
        echo ",\n";
    }
}
echo "]\n";

?>
