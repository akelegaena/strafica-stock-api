<?php

namespace App\Traits;

use App\Models\Log;
use Illuminate\Support\Facades\Auth;

trait LogActionTrait
{
    /**
     * Sauvegarde un log d’action dans la base de données
     *
     * @param string $action        Nom de l'action (ex: USER_CREATED)
     * @param array|null $newData   Données après action
     * @param array|null $oldData   Données avant action
     * @param array|null $changes   Changements spécifiques
     */
    public function logAction(
        string $action,
        ?array $newData = null,
        ?array $oldData = null,
        ?array $changes = null
    ): void
    {
        Log::create([
            'action' => $action,
            'details' => [
                'user_id'   => Auth::check() ? Auth::id() : null,
                'old'       => $oldData,
                'new'       => $newData,
                'changes'   => $changes,
            ],
            'user_id' => Auth::check() ? Auth::id() : null,
        ]);
    }
}
