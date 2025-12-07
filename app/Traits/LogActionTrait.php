<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use App\Models\Log;

trait LogActionTrait
{
    /**
     * Enregistre un log complet.
     */
    public function logAction(
    string $action,
    ?Model $model = null,
    array $before = null,
    array $after = null
)

    {
        Log::create([
            'action' => $action,
            'details' => [
                'model'  => $model ? class_basename($model) : null,
                'id'     => $model->id ?? null,
                'before' => $before,
                'after'  => $after,
            ],
            'user_id' => auth()->id(),
        ]);
    }
}
