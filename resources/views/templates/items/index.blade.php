<script id="items-list-template" type="x-template">
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


        <input type="text" class="form-control typeahead-required" id="client-filter-typeahead"
               v-model="client_filter_input_text"
               v-on="change: filterToSelectedClient, keyup: filterToSelectedClient | key 'enter'"
               v-attr="disabled: filtered_to_client_id != ''">
        <div class="input-group-addon btn-clear-selected-item"
             v-show="filtered_to_client_id"
             v-on="click: removeFilterToSelectedClient"><span class="fa fa-remove"></span></div><!--v-if-end-->
    </div>


    <input type="hidden" name="" v-model="client_filter"><br/>

    <!-- inline create new record -->


    <table class="table table-bordered table-striped table-hover tablesaw" data-tablesaw-mode="stack">

        <thead>
        <tr>

            <th
                    v-repeat="column in columns"
                    v-on="click: sortBy(column.id)">
                @{{ column.name }}
                <span class="fa fa-caret-up" v-if="sortKey == column.id && reverse == false"></span>
                <span class="fa fa-caret-down" v-if="sortKey == column.id && reverse == true"></span>
            </th>
            <th>Actions</th>


        </tr>
        </thead>
        <tbody>
        <tr class="clickable"
            v-repeat="item in items | orderBy sortKey reverse"
                >
            <td> <a href="/items/@{{ item.id }}">@{{ item.item_name }}</td>
            <td><a href="/clients/@{{ item.client_id }}">@{{ item.client_name }}</a></td>
            <td>@{{ item.item_code }}</td>
            <td>@{{ item.quantity }}</td>
            <td>@{{ item.minimum_level }}</td>
            <td title="@{{ item.created_at }}">@{{ item.human_created_at }}</td>
            <td>
                @include("items.index-actions")

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
                <input type="text" class="form-control typeahead-required"  id="client-name-typeahead"
                       v-on="change: getSelectedClient, keyup: getSelectedClient | key 'enter'"
                       v-model="new_item.client_name">

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
        </tbody>

    </table>
    <!-- end inline create new record -->
</div>
</div>
</div>
</script>