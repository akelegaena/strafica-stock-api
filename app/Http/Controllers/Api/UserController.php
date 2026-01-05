<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Traits\LogActionTrait;

class UserController extends Controller
{
    use LogActionTrait;

    /**
     * Liste des utilisateurs (paginée)
     */
    public function index()
    {
        return UserResource::collection(
            User::with('role')->orderBy('name', 'asc')->paginate(10)
        );
    }

    /**
     * Ajouter un utilisateur
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        // Hash du mot de passe
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        // 🔥 LOG création
        $this->logAction("USER_CREATED", $user->toArray());

        return new UserResource($user->load('role'));
    }

    /**
     * Afficher un utilisateur
     */
    public function show(User $user)
    {
        return new UserResource($user->load('role'));
    }

    /**
     * Modifier un utilisateur
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $before = $user->toArray();

        $data = $request->validated();

        // Si password envoyé → re-hasher
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        // 🔥 LOG modification
        $this->logAction("USER_UPDATED", $user->toArray(), $before, $data);

        return new UserResource($user->fresh()->load('role'));
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(User $user)
    {
        $before = $user->toArray();

        $user->delete();

        // 🔥 LOG suppression
        $this->logAction("USER_DELETED", $before);

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }

    /**
     * Changer le rôle d’un utilisateur
     */
    public function changeRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $before = $user->toArray();

        $user->update(['role_id' => $request->role_id]);

        // 🔥 LOG changement de rôle
        $this->logAction("USER_ROLE_CHANGED", $user->toArray(), $before, [
            'role_id' => $request->role_id
        ]);

        return new UserResource($user->fresh()->load('role'));
    }

    /**
     * Réinitialisation du mot de passe
     */
    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:6'
        ]);

        $before = $user->toArray();

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // 🔥 LOG reset mot de passe
        $this->logAction("USER_PASSWORD_RESET", $user->toArray(), $before);

        return response()->json(['message' => 'Mot de passe réinitialisé.']);
    }
}
