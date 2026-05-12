<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
        
    }

    public function boot(): void
    {
        VerifyEmail::createUrlUsing(function (object $notifiable) {
            $url = URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );
            return env('FRONTEND_URL', 'http://localhost:5173').'/verify-email-callback?verify_url='.urlencode($url);
        });
    }
}
