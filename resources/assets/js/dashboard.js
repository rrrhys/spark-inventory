
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
                created_at_human: "10m ago",
                item: {item_name: ""}
            },
            {
                quantity: -5,
                item_name: "Bottle Caps",
                created_at_human: "20m ago",
                item: {item_name: ""}
            },
            {
                quantity: -7,
                item_name: "Bottle Caps",
                created_at_human: "24m ago",
                item: {item_name: ""}
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
            $.get('/api/v1/items/?perPage=10000', function(response){
                var ta =$("#item-name-typeahead");
                for(var i = 0; i <response.data.length; i++){
                    response.data[i].name = response.data[i].item_name;
                }
                ta.typeahead({
                    source:response.data,
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

