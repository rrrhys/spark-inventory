<?php

namespace App\Http\Controllers\API;

use Auth;
use App\Item;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

/* The dashboard controller is read only
    So does not have the usual CRUD. */
class DashboardController extends Controller
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
        $responseData = [];
        $responseData['itemsBelowMinimum'] = $user->items()->belowMinimum()->get();
        $responseData['feed'] = $user->movements()->recent()->with('Item')->get();

        return response()->json([
            'result'=>'success',
            'data'=>$responseData
        ], 200);
    }

}
