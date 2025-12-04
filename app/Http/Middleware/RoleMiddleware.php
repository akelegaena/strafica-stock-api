<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle($request, Closure $next, $role)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (auth()->user()->role->nom !== $role) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return $next($request);
    }
}
