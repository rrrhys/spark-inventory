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
        $perPage = 20;
        if($request->has('perPage')){
            $perPage = $request->get('perPage');
        }
        if($request->has('max')){
            $limit = (int)$request->get('max');
        }
        $user = Auth::User();
        $item = $user->items()->whereId($item_id)->firstOrFail();
        $movements = $item->movements()->paginate($perPage);
        return response()->json($movements, 200);
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
    public function store(Requests\CreateItemMovementRequest $request, $item_id)
    {
        //

        $movement = new Movement($request->all());
        $movement->user_id = Auth::User()->id;
        $item = Auth::User()->items()->whereId($item_id)->firstOrFail();

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
    public function show($item_id, $id)
    {
        $item = Auth::User()->items()->whereId($item_id)->firstOrFail();

        return response()->json([
            'result'=>'success',
            'movement' => $item->movements()->whereId($id)->firstOrFail(),
            'item'=>$item,
        ], 200);
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
