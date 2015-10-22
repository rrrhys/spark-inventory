<?php
/* using this component:
Must be in a Vue context with editItem(item, $event) and deleteItem(item, $event) methods.
*/
?>

<div class="dropdown">
    <button
            class="btn btn-default dropdown-toggle btn-block"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
            v-on="click: deleteConfirm = false">
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
        <li><a v-on="click:editItem(item, $event)">Edit</a></li>
        <li><a href="/items/@{{ item.id }}/movements/in">Check In</a></li>
        <li><a href="/items/@{{ item.id }}/movements/out">Check Out</a></li>
        <li role="separator" class="divider"></li>
        <li>
            <a v-on="click:deleteAreYouSure" v-show="!deleteConfirm">Delete</a>
            <a v-show="deleteConfirm" class="bg-danger">Are you sure?
                <button class="btn btn-link" v-on="click: deleteItem(item, $event)">Yes</button></a>
        </li>
    </ul>

</div>