<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->rol !== 'admin') {
            return response()->json([
                'mensaje' => 'No autorizado'
            ], 403);
        }

        return $next($request);
    }
}
