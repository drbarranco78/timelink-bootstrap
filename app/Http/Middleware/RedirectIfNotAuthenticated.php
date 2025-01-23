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
        $user = Auth::user();
        if ($user->rol == 'trabajador') {
            return $next($request);
        }
        abort(401);       
    }

}
