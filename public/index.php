<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';   // LOCAL USAGE
// require_once dirname(__DIR__).'/tripbooking_react_source/vendor/autoload_runtime.php'; // PRODUCTION USAGE

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
