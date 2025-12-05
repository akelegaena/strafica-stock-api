<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\UserPasswordRequest;
use App\Http\Requests\UserRoleRequest;
use App\Http\Resources\UserResource;

use App\Models\User;

class UserController extends Controller
{
    // GET /users
    public function index()
    {
        return UserResource::collection(
            User::with('role')->paginate(20)
        );
    }

    // POST /users
    public function store(UserStoreRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        return new UserResource($user);
    }

    // GET /users/{id}
    public function show(User $user)
    {
        return new UserResource($user->load('role'));
    }

    // PUT /users/{id}
    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();

        $user->update($data);

        return new UserResource($user);
    }

    // PATCH /users/{id}/change-role
    public function changeRole(UserRoleRequest $request, User $user)
    {
        $user->update([
            'role_id' => $request->role_id
        ]);

        return response()->json([
            'message' => 'Rôle modifié avec succès',
            'user' => new UserResource($user)
        ]);
    }

    // PATCH /users/{id}/change-password
    public function changePassword(UserPasswordRequest $request, User $user)
    {
        $user->update([
            'password' => bcrypt($request->password)
        ]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }

    // DELETE /users/{id}
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé'
        ]);
    }
}
