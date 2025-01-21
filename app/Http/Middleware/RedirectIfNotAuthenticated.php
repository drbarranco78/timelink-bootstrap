<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Auth;

class RedirectIfNotAuthenticated
{
    public function handle($request, Closure $next)
    {
        
        if (!Auth::check() && !$this->isPublicRoute($request)) {
            return redirect('/'); // Redirige a la raíz si no está autenticado
        }

        return $next($request);
    }

    private function isPublicRoute(Request $request)
    {
        
        $publicRoutes = ['/', '/login'];
        return in_array($request->path(), $publicRoutes);
    }
}