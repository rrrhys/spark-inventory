@extends('spark::layouts.app')

@section('content')


    <div id="context-test">
        <movement-create passed_direction="{{$direction}}" passed_id={{$item_id}}></movement-create>
    </div>
@endsection