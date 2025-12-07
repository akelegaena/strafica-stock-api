<?php

namespace App\Traits;

use App\Models\Log;

trait LogActionTrait
{
    public function logAction($action, $details = [])
    {
        Log::create([
            'action' => $action,
            'details' => $details,
            'user_id' => auth()->id(),
        ]);
    }
}
