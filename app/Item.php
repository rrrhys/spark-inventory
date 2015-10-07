<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    //

    protected $fillable = ['item_name', 'item_code', 'quantity', 'minimum_level'];
    protected $appends = array('human_created_at');
    protected $dates = ['deleted_at'];

    use SoftDeletes;

    public function getCreatedAtAttribute($date)
    {
        $date = new \Carbon\Carbon($date);
        // Now modify and return the date

        return $date->toRfc1123String();
    }
    public function getHumanCreatedAtAttribute($date)
    {
        $date = new \Carbon\Carbon($this->created_at);
        // Now modify and return the date

        return $date->diffForHumans();
    }

    public function scopeBelowMinimum($query){
        return $query->whereRaw('quantity < minimum_level');
    }
    public function scopeMatching($query, $string){
        return $query->where('item_name','like',$string)->orWhere('item_code','like',$string);
    }

    public function movements(){
        return $this->hasMany('App\Movement')->orderBy('created_at','desc');
    }
}
