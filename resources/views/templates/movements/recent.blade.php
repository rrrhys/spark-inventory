

<script id="movements-recent-template" type="x-template">
    <h4>Recent Movements:</h4>
    <table class="table">
        <tr>
            <th>When</th>
            <th>Quantity</th>
            <th>Notes</th>
        </tr>
        <tr v-repeat="movements">
            <td title="@{{ created_at }}">
                @{{human_created_at}}
            </td>
            <td>@{{ quantity }}</td>
            <td>@{{ description }}</td>
        </tr>
        <tr v-if="movements.length == 0">
            <td colspan="42">No movements for this item</td>
        </tr>
        <tr>
            <td colspan="42"><a href="/items/@{{ item_id }}/movements/create/in">Check in</a> | <a href="/items/@{{ item_id }}/movements/create/in">Check out</a></td>
        </tr>
    </table>
</script>