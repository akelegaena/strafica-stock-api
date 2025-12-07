<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Traits\LogActionTrait;

class UserController extends Controller
{
    use LogActionTrait;

    /**
     * Liste des utilisateurs
     */
    public function index()
    {
        return User::with('role')->paginate(10);
    }

    /**
     * Création d’un utilisateur
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        // 🔥 LOG création
        $this->logAction(
            'USER_CREATED',
            $user,
            null,
            $user->toArray()
        );

        return response()->json(['message' => 'Utilisateur créé avec succès', 'user' => $user], 201);
    }

    /**
     * Détails utilisateur
     */
    public function show(User $user)
    {
        return $user->load('role');
    }

    /**
     * Modification utilisateur
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $before = $user->toArray();

        $user->update($request->validated());

        // 🔥 LOG MAJ
        $this->logAction(
            'USER_UPDATED',
            $user,
            $before,
            $user->fresh()->toArray()
        );

        return response()->json(['message' => 'Utilisateur modifié', 'user' => $user->fresh()]);
    }

    /**
     * Changer le rôle d’un utilisateur
     */
    public function changeRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $before = $user->toArray();

        $user->role_id = $request->role_id;
        $user->save();

        // 🔥 LOG changement de rôle
        $this->logAction(
            'USER_ROLE_CHANGED',
            $user,
            $before,
            $user->fresh()->toArray()
        );

        return response()->json(['message' => 'Rôle mis à jour', 'user' => $user]);
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|min:6'
        ]);

        $before = ['password' => '***'];

        $user->password = Hash::make($request->password);
        $user->save();

        // 🔥 LOG changement du mot de passe
        $this->logAction(
            'USER_PASSWORD_CHANGED',
            $user,
            $before,
            ['password' => '***']
        );

        return response()->json(['message' => 'Mot de passe mis à jour']);
    }

    /**
     * Suppression d’un utilisateur
     */
    public function destroy(User $user)
    {
        $before = $user->toArray();

        $user->delete();

        // 🔥 LOG suppression
        $this->logAction(
            'USER_DELETED',
            $user,
            $before,
            null
        );

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
