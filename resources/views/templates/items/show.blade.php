<script id="item-show-template" type="x-template">

    <div class="crumb"><small><a href="/home">Back to dashboard</a></small></div>

    <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading" v-show="item">Information for @{{ item.item_name }}</div>
                <div class="panel-body">
                    <a href="/items/@{{ item_id }}/movements/create/in">Check In</a> |
                    <a href="/items/@{{ item_id }}/movements/create/out">Check Out</a> |
                    <a href="/items/@{{ item_id }}/movements/">Movement Report</a>
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
                                <tr>
                                    <th>Minimum</th>
                                    <td>@{{ item.minimum_level }}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-sm-7">
                            <movements-recent passed_item_id="@{{ item_id }}" passed_item="@{{ item }}" v-if="item">

                            </movements-recent>

                        </div>

                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <movements-chart>

                            </movements-chart>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
</script>