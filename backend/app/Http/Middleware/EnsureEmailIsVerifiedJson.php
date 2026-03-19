<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerifiedJson
{
    /**
     * Handle an incoming request.
     * Returns a JSON 403 response if the authenticated user has not verified
     * their email address, instead of redirecting to a Blade view.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()
            || ($request->user() instanceof MustVerifyEmail
                && ! $request->user()->hasVerifiedEmail())) {
            return response()->json([
                'message' => 'Your email address is not verified.',
            ], 403);
        }

        return $next($request);
    }
}
