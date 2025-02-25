<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('Authorization');  // El nombre del header puede ser cualquier
        if (!$apiKey || $apiKey !== 'Bearer ' . env('API_KEY')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
