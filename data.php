<?php

// Включение отображения ошибок для диагностики
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Подключение к базе данных
$secretKey = '6Lcmy_MqAAAAAFm8tf2MAsKw3UINVLT6YjPhwRdt';
$userIp = $_SERVER['REMOTE_ADDR'];

// Проверка наличия g-recaptcha-response
if (!isset($_POST['g-recaptcha-response'])) {
    echo json_encode(['success' => false, 'error' => 'MISSING_CAPTCHA']);
    exit;
}

// Использование cURL для проверки капчи
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret' => $secretKey,
    'response' => $_POST['g-recaptcha-response'],
    'remoteip' => $userIp
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['success' => false, 'error' => 'CURL_ERROR']);
    exit;
}
curl_close($ch);
$data = json_decode($response);

// Добавление отправки данных в Telegram
$telegramToken = '7730952985:AAHlfHRO7n9d3rDE-iezdrTqn3GqVGULacc';
$chatId = '1966462010';

if ($data->success) {
    // Обновление параметров формы для использования значений вместо имён
    $message = "Новая заявка:\n" .
               "Имя: " . ($_POST['name'] ?? 'Не указано') . "\n" .
               "Телефон: " . ($_POST['phone'] ?? 'Не указано') . "\n" .
               "Сообщение: " . ($_POST['message'] ?? 'Не указано') . "\n" .
               "Адрес: " . ($_POST['address'] ?? 'Не указано') . "\n" .
               "Материал: " . match ($_POST['var_fence'] ?? 'Не указано') {
                   'var_1' => 'Забор из сетки рабица',
                   'var_2' => 'Забор из профнастила',
                   'var_3' => 'Забор из евроштакетника',
                   'var_4' => 'Забор из 3D-сетки',
                   default => 'Не указано'
               } . "\n" .
               "Длина забора: " . ($_POST['size_fence'] ?? 'Не указано') . "\n" .
               "Ворота: " . match ($_POST['var_gate'] ?? 'Не указано') {
                   'var_swing' => 'Распашные',
                   'var_rollback' => 'Откатные',
                   'var_no' => 'Нет',
                   default => 'Не указано'
               } . "\n" .
               "Калитка: " . match ($_POST['var_door'] ?? 'Не указано') {
                   'var_yes' => 'Да',
                   'var_no' => 'Нет',
                   default => 'Не указано'
               };

    $telegramUrl = "https://api.telegram.org/bot$telegramToken/sendMessage";
    $telegramData = [
        'chat_id' => $chatId,
        'text' => $message
    ];

    // Использование cURL для отправки данных в Telegram
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $telegramUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($telegramData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        echo json_encode(['success' => false, 'error' => 'CURL_ERROR', 'details' => curl_error($ch)]);
        curl_close($ch);
        exit;
    }
    curl_close($ch);

    // Проверка ответа Telegram API
    $responseData = json_decode($result, true);
    if (!$responseData['ok']) {
        echo json_encode(['success' => false, 'error' => 'TELEGRAM_API_ERROR', 'details' => $responseData['description']]);
        exit;
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'CAPTCHA_FAILED']);
}
