<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Traits\LogActionTrait;

class AuthController extends Controller
{
    use LogActionTrait;

    /**
     * Login API
     */
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        // 🔎 Vérification utilisateur
        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // 🔑 Création du token
        $token = $user->createToken('api_token')->plainTextToken;

        // 🔥 LOG : Connexion réussie
        $this->logAction(
            'LOGIN_SUCCESS',
            $user,
            null,
            [
                'user_id'   => $user->id,
                'email'     => $user->email,
                'role'      => $user->role->nom ?? null,
                'ip'        => $request->ip(),
                'user_agent'=> $request->header('User-Agent'),
            ]
        );

        return response()->json([
            'message' => 'Connexion réussie',
            'token'   => $token,
            'user'    => $user->load('role')
        ]);
    }

    /**
     * Logout API
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            // 🔥 LOG : Déconnexion réussie
            $this->logAction(
                'LOGOUT_SUCCESS',
                $user,
                null,
                [
                    'user_id' => $user->id,
                    'email'   => $user->email
                ]
            );

            // Suppression du token actuel
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
