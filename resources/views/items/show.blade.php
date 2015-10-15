@extends('spark::layouts.app')

@section('content')


    <script>

    </script>
    <div class="container spark-screen" id="item_show">
        <input type="hidden" name="item_id" v-model="item_id" value="{{$item_id}}">

        <div class="crumb"><small><a href="/home">Back to dashboard</a></small></div>

        <div class="row">
            <div class="col-sm-8 col-sm-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading" v-show="item">Information for @{{ item.item_name }}</div>
                    <div class="panel-body">
                        <a href="{{ route('items.movements.create.direction',['items'=>$item_id,'direction'=>'in'])  }}">Check In</a> |
                        <a href="{{ route('items.movements.create.direction',['items'=>$item_id,'direction'=>'out'])  }}">Check Out</a> |
                        <a href="{{ route('items.movements.index',['items'=>$item_id])  }}">Movement Report</a>
                        <div class="row">
                            <div class="col-sm-5">
                                <h4>Item details:</h4>
                                <table class="table">
                                    <tr>
                                        <th>Name</th>
                                        <td>@{{ item.item_name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Code</th>
                                        <td>@{{ item.item_code }}</td>
                                    </tr>
                                    <tr>
                                        <th>Quantity</th>
                                        <td>@{{ item.quantity }}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-sm-7">
                                <h4>Recent Movements:</h4>
                                <table class="table">
                                    <tr>
                                        <th>When</th>
                                        <th>Quantity</th>
                                        <th>Notes</th>
                                    </tr>
                                    <tr v-repeat="movements">
                                        <td title="@{{ created_at }}">@{{human_created_at}}</td>
                                        <td>@{{ quantity }}</td>
                                        <td>@{{ description }}</td>
                                    </tr>
                                    <tr v-if="movements.length == 0">
                                        <td colspan="42">No movements for this item</td>
                                    </tr>
                                </table>

                            </div>

                        </div>
                        <div class="row">
                            <div class="col-xs-12">

                                <div id="chart_div"></div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
@endsection