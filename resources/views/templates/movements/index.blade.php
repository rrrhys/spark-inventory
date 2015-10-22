
<script id="movement-list-template" type="x-template">
    <div class="panel panel-default">
        <div class="panel-heading">Movement Report</div>

        <div class="panel-body">

            <input type="hidden" name="" v-model="item_id" value="@{{ item.id }}">

            All movements for item <a href="/items/@{{ item.id }}">@{{item.item_name}}</a><br/>

            <a class="pagination-arrow clickable" v-show="current_page > 1" v-on="click: fetchItems(current_page-1)">&lt;</a>
            Showing <span>@{{ from }}</span> to <span>@{{ to }}</span> (of <span>@{{ total }}</span>)
            <a class="pagination-arrow clickable" v-show="current_page < last_page" v-on="click: fetchItems(current_page+1)">&gt;</a>

            <table class="table table-bordered table-hover">
                <tr>
                    <th>Date/Time</th>
                    <th>Description</th>
                    <th>Reference</th>
                    <th>Quantity Moved</th>
                    <th>Final Quantity</th>
                </tr>
                <tr v-repeat="movement in movements">
                    <td>@{{ movement.local_time }}</td>
                    <td>@{{ movement.description }}</td>
                    <td>@{{ movement.reference }}</td>
                    <td class="number" v-class="negative: movement.quantity < 0">@{{ movement.quantity > 0 ? "+" + movement.quantity : movement.quantity }}</td>
                    <td class="number" v-class="negative: movement.result_quantity < 0">@{{ movement.result_quantity }}</td>
                </tr>
            </table>
        </div>
    </div>
</script>