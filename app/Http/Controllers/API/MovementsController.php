<?php

namespace App\Http\Controllers\API;

use App\Item;
use Auth;
use App\Movement;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class MovementsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $item_id)
    {
        //
        $limit = 100;
        if($request->has('max')){
            $limit = (int)$request->get('max');
        }
        $user = Auth::User();
        $item = $user->items()->whereId($item_id)->firstOrFail();
        $movements = $item->movements->take($limit);

        return response()->json([
            'result'=>'success',
            'movements'=>$movements->toArray()
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($item_id)
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $item_id)
    {
        //

        $user = Auth::User();
        $movement = new Movement($request->all());
        $movement->user_id = $user->id;
        $item = $user->items()->whereId($item_id)->firstOrFail();

        // saving the movement will modify the item.
        $item->movements()->save($movement);

        $movement->touch();


        

        return response()->json([
            'result'=>'success',
            'movement'=>$movement,
            'item'=>$item,
        ], 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
