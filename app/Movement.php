<?php

namespace App;
use App\Item;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movement extends Model
{
    //
    protected $fillable = ['description', 'quantity', 'reference'];
    protected $appends = array('human_created_at');
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

    public function item(){
        return $this->belongsTo('App\Item');
    }

    public function scopeRecent($query){
        return $query->orderBy('id','desc')->take(100);
    }
}
