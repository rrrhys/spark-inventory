<?php

namespace App\Http\Controllers\API;

use Auth;
use App\Item;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

/**
 * Class ItemsController
 * @package App\Http\Controllers\API
 */
class ItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $user = Auth::User();
        ;
        $perPage = 20;
        if($request->has('perPage')){
            $perPage = $request->get('perPage');
        }

        $clientId = null;
        if($request->has('clientId')){
            $clientId = $request->get('clientId');
            $client = $user->clients()->whereId($clientId)->firstOrFail();
            $response = $client->items()->with('Client')->paginate($perPage);
        }
        else{
            $response = $user->items()->with('Client')->paginate($perPage);
        }





        return response()->json($response, 200);
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
    public function store(Requests\CreateItemRequest $request)
    {
        //
        $user = Auth::User();
        if($request->has('id')){
            // is an update.
        }
        else{

            $item = new Item($request->all());
            $item = $user->items()->save($item);

            //populate relation
            $item->client;

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
