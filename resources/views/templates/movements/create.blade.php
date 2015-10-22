<script id="movement-create-template" type="x-template">

    <div class="crumb"><a href="/home">Dashboard</a></small> | <a href="/items/@{{ item_id }}">Back to @{{ item.item_name }}</a></div>

    <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading" v-show="item">New movement @{{ direction }} for <a href="/items/@{{ item.id }}">@{{ item.item_name }}</a></div>
                <div class="panel-body">
                    <form action="" v-on="submit: saveNewMovement">
                        <div class="form-group">
                            <label for="description">Description</label>
                            <input type="text" class="form-control" id="description" v-model="new_movement.description" placeholder="e.g. 'Goods Inwards', 'Delivery', 'Shortage'" autofocus />
                        </div>
                        <div class="form-group">
                            <label for="reference">Reference</label>
                            <input type="text" class="form-control" id="reference" v-model="new_movement.reference" placeholder="e.g. PO-1234">
                        </div>
                        <div class="form-group">
                            <label for="quantity">Quantity</label>
                            <input type="number" class="form-control" id="quantity" v-model="new_movement.quantity" >
                        </div>
                        <div class="form-group">
                            <label for="">Created By</label>
                            {{Auth::user()->name}}
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-3 col-sm-6">
                                <button type="submit" class="btn btn-default btn-block" v-attr="disabled: saving">Create</button>
                            </div>
                        </div>

                    </form>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-sm-5">
                            <h4>Item details:</h4>
                            <table class="table">
                                <tr>
                                    <th>Name</th>
                                    <td><a href="/items/@{{ item.id }}">@{{ item.item_name }}</a></td>
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

                </div>


            </div>
        </div>
    </div>
</script>
