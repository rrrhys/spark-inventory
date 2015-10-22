@extends('spark::layouts.app')

@section('content')

    (Movements/show)

    <div class="container spark-screen" id="item_movements_show">
        <div class="crumb"><small><a href="/items/@{{ item.id }}">Back to @{{item.item_name}}</a></small></div>
        <input type="hidden" name="id" value="{{$id}}" v-model="id">
        <input type="hidden" name="item_id" value="{{$item_id}}" v-model="item_id">

        @{{movement.quantity}}
    </div>

@endsection