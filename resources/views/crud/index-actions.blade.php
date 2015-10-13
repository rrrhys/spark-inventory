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