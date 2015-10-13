<?php

namespace App;

use Illuminate\Database\Eloquent\Model;;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    //
    protected $fillable = ['name'];
    use SoftDeletes;
    protected $table = "clients";

    public function items(){
        return $this->hasMany('App\Item');
    }
}
