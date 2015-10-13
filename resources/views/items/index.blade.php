@extends('spark::layouts.app')

@section('content')
        <!-- Main Content -->
<div class="container spark-screen">

    <div class="crumb"><small><a href="/home">Back to dashboard</a></small></div>
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default" id="list-items">
                <div class="panel-heading">Items</div>

                <div class="panel-body">
                    <a class="pagination-arrow clickable" v-show="current_page > 1" v-on="click: fetchItems(current_page-1)">&lt;</a>
                    Showing <span>@{{ from }}</span> to <span>@{{ to }}</span> (of <span>@{{ total }}</span>)
                    <a class="pagination-arrow clickable" v-show="current_page < last_page" v-on="click: fetchItems(current_page+1)">&gt;</a>

                    <br/>
                    Filter to client:

                    <div class="input-group" style="width:100%;">


                        <input type="text" class="form-control" data-provide="typeahead" id="client-filter-typeahead"
                               v-model="client_filter_input_text"
                               v-on="change: filterToSelectedClient, keyup: filterToSelectedClient | key 'enter'"
                               v-attr="disabled: filtered_to_client_id != ''">
                        <div class="input-group-addon btn-clear-selected-item"
                             v-show="filtered_to_client_id"
                                v-on="click: removeFilterToSelectedClient"><span class="fa fa-remove"></span></div><!--v-if-end-->
                    </div>


                    <input type="hidden" name="" v-model="client_filter"><br/>


                    <table class="table table-bordered table-striped table-hover">
                        <tr>
                            <th class="col-md-3">Item Name</th>
                            <th>Client</th>
                            <th>Code</th>
                            <th class="col-md-2">Quantity</th>
                            <th class="col-md-2">Minimum Level</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                        <tr class="clickable" v-repeat="item in items" v-on="click: redirectToURL('/items/' + item.id)">
                            <td>@{{ item.item_name}}</td>
                            <td>@{{ item.client.name }}</td>
                            <td>@{{ item.item_code }}</td>
                            <td>@{{ item.quantity }}</td>
                            <td>@{{ item.minimum_level }}</td>
                            <td title="@{{ item.created_at }}">@{{item.human_created_at}}</td>
                            <td>
                                <div class="dropdown">
                                    <button
                                            class="btn btn-default dropdown-toggle btn-block"
                                            type="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="true"
                                            v-on="click: deleteConfirm = false">
                                        Actions
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a href="#">Edit</a></li>
                                        <li>
                                            <a v-on="click:deleteAreYouSure" v-show="!deleteConfirm">Delete</a>
                                            <a v-show="deleteConfirm" class="bg-danger">Are you sure?
                                                <button class="btn btn-link" v-on="click: deleteItem(item, $event)">Yes</button></a>
                                        </li>
                                    </ul>

                                </div>
                            </td>
                        </tr>
                        <tr v-if="items.length == 0">
                            <td colspan="42">There are no items.</td>
                        </tr>
                        <tr>
                            <td>
                                <input type="text" class="form-control" v-model="new_item.item_name">
                            </td>
                            <td>
                                <input type="text" class="form-control" data-provide="typeahead" id="client-name-typeahead"
                                       v-on="change: getSelectedClient, keyup: getSelectedClient | key 'enter'">
                                <input type="hidden" name="" v-model="new_item.client_id">
                            </td>
                            <td>
                                <input type="text" class="form-control" v-model="new_item.item_code">
                            </td>
                            <td>
                                <input type="number" class="form-control" v-model="new_item.quantity">
                            </td>
                            <td>
                                <input type="number" class="form-control" v-model="new_item.minimum_level">
                            </td>
                            <td></td>
                            <td>
                                <button class="btn btn-default btn-block" v-on="click: saveNewItem">Save</button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>

</div>
@endsection
