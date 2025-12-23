<?php

use Illuminate\Foundation\Application;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {

        // ❌ REMOVE this — it causes CSRF mismatch with API tokens
        // $middleware->api(prepend: [
        //     \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ]);

        // ✔️ API routes MUST NOT use stateful middleware (we use Bearer tokens)
        $middleware->api(prepend: [
            // Nothing required here
        ]);

        // ⭐ Your custom middleware
        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role'     => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {
         $exceptions->render(function (AuthenticationException $e, Request $request) {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Non authentifié'
            ], 401);
        }
    });
    })

    ->create();
