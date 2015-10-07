<?php

namespace App\Http\Controllers\API;

use Auth;
use App\Item;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $user = Auth::User();
        $items = $user->items;
        return response()->json([
            'result'=>'success',
            'items'=>$items->toArray()
        ], 200);
    }

    public function find($string){
        $user = Auth::User();
        $string = "%$string%";
        $items = $user->items()->matching($string)->get();

        return response()->json([
            'result'=>'success',
            'items'=>$items->toArray()
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $user = Auth::User();
        if($request->has('id')){
            // is an update.
        }
        else{

            $item = new Item($request->all());
            $user->items()->save($item);

        }

        return response()->json([
            'result'=>'success',
            'item'=>$item
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
        //

        $user = Auth::User();
        try{
            $item = $user->items()->whereId($id)->firstOrFail();

        }
        catch(Exception $ex){
            return response('Not found',404);
        }


        return response()->json([
            'result'=>'success',
            'item'=>$item
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
        $user = Auth::User();
        $item = $user->items()->find($id);

        $item->delete();

        return response()->json([
            'result'=>'success',
            'item'=>$item
        ], 200);
    }
}
