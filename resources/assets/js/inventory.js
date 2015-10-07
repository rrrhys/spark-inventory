Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');
Vue.config.debug = true; // turn on debugging mode
var $ = require('jquery');
require('./bootstrap3-typeahead.js');




function addAlert(message, type){
    var alert = $("#alert-template").html();
    alert = alert.replace("{alert-type}", type);
    alert = alert.replace("{alert-message}", message);

    var $alert = $(alert);
    $(".overlay-alert").append($alert);

    window.setTimeout(function(){
        $alert.fadeOut(1000, function(){$alert.remove()});
    },5000);
}

$("#item_movement").length > 0 ? new Vue({
    el: "#item_movement",
    ready: function(){
        console.log(this.item_id);
        this.fetchItem();
        this.fetchLastMovements();

    },

    data: {
        item: {name: "Loading.."},
        item_id: "",
        direction: "",
        movements: [],
        new_movement: {
            description: "",
            reference: "",
            quantity: ""
        },
        saving: false,
    },
    methods: {
        fetchItem: function(){
            this.$http.get("/api/v1/items/" + this.item_id, function(response){
                this.item = response.item;
            });
        },
        fetchLastMovements: function(){
            this.$http.get("/api/v1/items/"+ this.item_id + "/movements?max=5", function(response){
                this.movements = response.movements;
            });
        },
        saveNewMovement: function(e){
            this.saving = true;
            e.preventDefault();
            var toSend = this.new_movement;
            this.new_movement.quantity *= this.direction;
            debugger;
            this.$http.post("/api/v1/items/" + this.item_id + "/movements/", this.new_movement, function(response){
                this.saving = false;
                this.movements.push(response.movement);
                this.item = response.item;

                this.new_movement.description = "";
                this.new_movement.reference = "";
                this.new_movement.quantity = "";
            });
        }
    }
}) : null;

$("#dashboard").length > 0 ? new Vue({
    el: '#dashboard',

    ready: function(){
        this.fetchDashboard();
        this.fetchTypeaheadItems();
    },

    data: {
        expectedDeliveries: [
            {
                id: 10,
                item_name: "Bottle Caps",
                expected_at: "2015-11-04 11:00:00 +1100"
            },
            {
                id: 11,
                item_name: "Bottle Caps",
                expected_at: "2015-11-04 11:00:00 +1100"
            },
        ],
        itemsBelowMinimum: [
            {
                id: 10,
                item_name: "Bottle Caps",
                expected_at: "2015-11-04 11:00:00 +1100",
                quantity: 500,
            },
            {
                id: 11,
                item_name: "Bottle Caps",
                expected_at: "2015-11-04 11:00:00 +1100",
                quantity: 400,
            },
        ],
        feed: [
            {
                quantity: 1000,
                item_name: "Bottle Caps",
                created_at_human: "10m ago"
            },
            {
                quantity: -5,
                item_name: "Bottle Caps",
                created_at_human: "20m ago"
            },
            {
                quantity: -7,
                item_name: "Bottle Caps",
                created_at_human: "24m ago"
            },
        ],
        showExpectedDeliveries: false,
        showItemsBelowMinimum: false,
        selectedItem: "",
    },
    methods: {
        fetchDashboard: function(){
            this.$http.get('api/v1/dashboard', function(response){
                for(var key in response.data){
                    this[key] = response.data[key];
                }
                // this.items = response.items;
            });
        },

        fetchTypeaheadItems: function(){
            $.get('/api/v1/items', function(data){
                var ta =$("#item-name-typeahead");
                for(var i = 0; i < data.items.length; i++){
                    data.items[i].name = data.items[i].item_name;
                }
                ta.typeahead({
                    source:data.items,
                });
            },'json');
        },

        getSelectedItem: function(){

            var ta =$("#item-name-typeahead");
            var current = ta.typeahead("getActive");

            if(current.id){
                this.selectedItem = current;

            }
        },

        clearSelectedItem: function(){
            this.selectedItem = "";
            $("#item-name-typeahead").val("").focus();
        },

        redirectToURL: function(url){
             document.location = url;
        }
    }
}) :  null;






// todo: Adding a blank item this way is silly.
$("#list-items").length > 0 ? new Vue({
    el: "#list-items",

    data: {
        items: [],
        new_item: {item_name: "",
            created_at: new moment()},
        deleteConfirm: false,
    },

    ready: function(){
        this.fetchItems();
    },

    methods: {
        fetchItems: function(){
            this.$http.get('api/v1/items', function(response){
                for(var i = 0; i < response.items.length; i++){
                    var item = response.items[i];

                    // add other properties.


                    this.items.push(item);
                }
            })
        },

        saveNewItem: function(){


            this.$http.post('api/v1/items', this.new_item, function(d){
                this.items.push(d.item);

                this.new_item = {item_name: "",
                    created_at: new moment().format()};
            });
        },

        deleteAreYouSure: function(e){
            this.deleteConfirm = true;

            e.stopPropagation();
        },

        deleteItem: function(item, e){

            var i = item;
            this.items.$remove(i);
            this.$http.delete('api/v1/items/' + item.id, {}, function(d){

                addAlert('Item Deleted', 'success');
            });
        }
    }

}) :  null;