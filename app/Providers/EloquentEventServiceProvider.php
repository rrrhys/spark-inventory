<?php

namespace App\Providers;

use App\Movement;
use Illuminate\Support\ServiceProvider;

class EloquentEventServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Movement::created(function ($movement) {
            $i = $movement->item;
            $i->quantity += $movement->quantity;
            $i->save();
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
