google.load('visualization', '1', {packages: ['corechart', 'line']});
var makeTableResponsive = function(){
    Vue.nextTick(function(){

        $(".tablesaw").table();
    });
};
var states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
];
$(function() {

});
Vue.component('dashboard', {
    template: document.querySelector("#dashboard-template"),
    data: function () {
        return {
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
        }
    },
    ready: function(){
        this.fetchDashboard();
        this.fetchTypeaheadItems();

    },
    props: [],
    methods: {
        fetchDashboard: function(){
            this.$http.get('api/v1/dashboard', function(response){
                for(var key in response.data){
                    this[key] = response.data[key];
                }
                // this.items = response.items;
                makeTableResponsive();
            });
        },

        fetchTypeaheadItems: function(){
            this.$http.get('/api/v1/items/?perPage=10000', function(response){



                for(var i = 0; i <response.data.length; i++){
                    response.data[i].name = response.data[i].item_name;
                } 

                var that = this;
                $("#item-name-autocomplete").autocomplete({
                    valueKey: 'item_name',
                    titleKey: 'item_name',
                    filter: function(items,query,source){
                        query = query.toLowerCase();
                        var query_barcoded = query.replace("*","");
                        var results = [],value = '';
                        for(var i in items){
                            if(items[i].item_name.toLowerCase().indexOf(query) > -1){
                                results.push(items[i]);
                            }
                            if(items[i].item_code.toLowerCase().indexOf(query_barcoded) > -1){
                                results.push(items[i]);
                            }
                        }

                            return results;

                    },
                    source:[
                        {
                            data: response.data
                        }
                    ]
                }).on('selected.xdsoft', function(e, obj){
                    that.selectedItem = obj;
                })

            },'json');
        },

        clearSelectedItem: function(){
            this.selectedItem = "";
            $("#item-name-typeahead").val("").focus();
        },

        redirectToURL: function(url){
            document.location = url;
        }
    }
});
Vue.component('movement-list', {
    template: document.querySelector("#movement-list-template"),
    data: function(){
        return {
            item_id: "",
            from: 0,
            to: 0,
            total: 0,
            current_page: 0,
            last_page: 0,
            movements: [],
            item: {},
        }
    },
    props: ['passed_item_id'],

    ready: function(){
        this.item_id = this.passed_item_id;
        this.fetchMovements();
        this.fetchItem();
    },
    methods: {
        fetchMovements: function(page){
            var moment = require('moment-timezone');
            var url = '/api/v1/items/' + this.item_id + '/movements?page=' + page + "&perPage=100";
            this.$http.get(url, function(response){
                this.from = response.from;
                this.to = response.to;
                this.total = response.total;
                this.current_page = response.current_page;
                this.last_page = response.last_page;
                this.movements = response.data;
                _.each(this.movements, function(m){
                    var mom = moment(m.created_at);
                    m.local_time = mom.tz('Australia/Sydney').format("ddd, MMM Do YYYY, h:mm:ss a");
                });


                this.item = response.item;
                makeTableResponsive();
            });
        },
        fetchItem: function(){
            var url = '/api/v1/items/' + this.item_id;
            this.$http.get(url, function(response){
                this.item = response.item;


            });
        }
    }
});
Vue.component('movement-create', {
    template: document.querySelector("#movement-create-template"),
    data: function(){
        return {
            item: false,
            item_id: "",
            direction: "",
            direction_int: 0,

            movements: [],
            new_movement: {
                description: "",
                reference: "",
                quantity: ""
            },
            saving: false,
        }
    },
    props: ['passed_direction', 'passed_id'],
    ready: function(){
        this.direction = this.passed_direction;
        this.direction_int = this.passed_direction == "in" ? 1 : -1;
        this.item_id = this.passed_id;
        this.fetchItem();
    },
    methods: {
        fetchItem: function(){
            this.$http.get("/api/v1/items/" + this.item_id, function(response){
                this.item = response.item;
            });
        },
        saveNewMovement: function(e){
            this.saving = true;
            e.preventDefault();
            this.new_movement.quantity *= this.direction_int;
            this.$http.post("/api/v1/items/" + this.item_id + "/movements/", this.new_movement, function(response){
                this.saving = false;
                this.movements.push(response.movement);
                this.$dispatch('new-movement-saved', response.movement);
                this.item = response.item;

                this.item.quantity += this.new_movement.quantity;
                this.new_movement.description = "";
                this.new_movement.reference = "";
                this.new_movement.quantity = "";
            }).error(function(d,s,r){
                // re-enable saving and call generic handler.
                this.saving = false;
                window.httpErrorHandler(d,s,r);
            });
        }
    }
});
Vue.component('movements-recent', {
    template: document.querySelector("#movements-recent-template"),
    data: function () {
        return {
            movements: [],
            item_id: 0
        }
    },
    props: ['passed_item_id', 'passed_item'],
    ready: function(){
        this.item_id = this.passed_item_id;
        this.item = this.passed_item;
        this.fetchLastMovements();
    },
    created: function(){
        this.$on('new-movement-saved', function(movement){
            this.movements.push(movement);
            this.$dispatch('movements-received');
        });
    },
    methods: {
        fetchLastMovements: function(){
            this.$http.get("/api/v1/items/"+ this.item_id + "/movements?perPage=50", function(response){
                this.movements = response.data;
                // this.loadChart(response.data);

                this.$dispatch("movements-received", {movements: response.data, item: this.item});

            });
        },
    }
});
Vue.component('movements-chart', {
    template: '<div id="chart_div"></div>',
    data: function () {
        return {item: false}
    },
    created: function(){
        this.$on('movements-received', function(movements){
            this.loadChart(movements);
        });
    },
    props: [],
    methods: {

        loadChart: function(movement_data){
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'X');
            data.addColumn('number', 'In Store');
            data.addColumn('number', 'Minimum');

            var options = {
                hAxis: {
                    title: 'Date'
                },
                vAxis: {
                    title: 'In Store'
                }
            };

            var chart_data = [];
            for(var i = 0; i < movement_data.movements.length; i++){
                var row = [new moment(movement_data.movements[i].created_at).toDate(), movement_data.movements[i].result_quantity, movement_data.item.minimum_level];
                chart_data.push(row);
            }
            data.addRows(chart_data);

            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(data, options);


        },
    }
});
Vue.component('item-show', {
    template: document.querySelector("#item-show-template"),
    data: function () {
        return {
            item: false,
            item_id: "",
            direction: "",
            movements: [],
            new_movement: {
                description: "",
                reference: "",
                quantity: ""
            },
            saving: false,
        }
    },
    props: ['passed_item_id'],
    ready: function(){
        this.item_id = this.passed_item_id;
        this.fetchItem();
       // this.fetchLastMovements();

    },
    methods: {
        fetchItem: function(){
            this.$http.get("/api/v1/items/" + this.item_id, function(response){
                this.item = response.item;
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
});
Vue.component('items-list', {
    template: document.querySelector("#items-list-template"),
    data: function () {
        return {
            items: [],
            new_item: {item_name: "", client: {},
                created_at: new moment()},
            deleteConfirm: false,
            from: 0,
            to: 0,
            total: 0,
            current_page: 0,
            last_page: 0,
            filtered_to_client_id: "",
            client_filter_input_text: '',
            sortKey: 'item_name',
            reverse: false,
            columns: [
                {id:'item_name', name:"Name", click: function(a,b,c){
                    this.redirectToURL('/items/' + item.id);
                } },
                {id:'client_name', name:"Client" },
                {id:'item_code', name:"Code" },
                {id:'quantity', name:"Qty" },
                {id:'minimum_level', name:"Min Level" },
                {id:'created_at', name:"Created" }],
        }
    },
    props: [],
    ready: function(){
        this.fetchItems();
        this.clientNameTypeahead();
    },

    methods: {
        sortBy: function(sortKey){
            var column = null;
            for(var i = 0; i < this.columns.length; i++){
                if(this.columns[i].name == sortKey){
                    column = this.columns[i];
                    break;
                }
            }
            this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
            this.sortKey = sortKey;
        },
        fetchItems: function(page){
            var url = 'api/v1/items?page=' + page;
            if(this.filtered_to_client_id){
                url += "&clientId=" + this.filtered_to_client_id;
            }

            this.$http.get(url, function(response){
                this.from = response.from;
                this.to = response.to;
                this.total = response.total;
                this.current_page = response.current_page;
                this.last_page = response.last_page;
                this.items = [];
                for(var i = 0; i < response.data.length; i++){
                    var row = response.data[i];
                    row.client_id = row.client.id;
                    row.client_name = row.client.name;

                    this.items.push(row);

                }
                makeTableResponsive();
            });
        },

        saveNewItem: function(){

            /* if(this.new_item.item_name == ""){
             addAlert("Please add an item name.", "danger");
             return;
             }*/

            this.$http.post('api/v1/items', this.new_item, function(d){
                d.item.client_id = d.item.client.id;
                d.item.client_name = d.item.client.name;
                this.items.push(d.item);
                this.new_item = {item_name: "",
                    created_at: new moment().format()};
            }).error(httpErrorHandler);
        },
        redirectToURL: function(url){
            document.location = url;
        },
        clientNameTypeahead: function(){

            $.get('/api/v1/clients', function(data){
                var ta =$("#client-name-typeahead");
                if(ta.typeahead){
                    ta.typeahead({
                        source:data.clients,
                    });
                }

                var ta = $("#client-filter-typeahead");
                if(ta.typeahead){

                    ta.typeahead({
                        source:data.clients,
                    });
                }

            },'json');
        },
        getSelectedClient: function(){
            var ta =$("#client-name-typeahead");
            var current = ta.typeahead("getActive");

            if(current.id){
                this.new_item.client_id = current.id;
                this.new_item.client = current;

            }
        },
        filterToSelectedClient: function(){
            var ta =$("#client-filter-typeahead");
            var current = ta.typeahead("getActive");

            if(current.id){
                this.filtered_to_client_id = current.id;
                this.fetchItems(0);

            }
        },
        removeFilterToSelectedClient: function(e){
            this.filtered_to_client_id = "";
            this.client_filter_input_text = "";
            this.fetchItems(0);
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
        },
        editItem: function(item, e){
            var i = item;

        }
    }
});

new Vue({
    el: "#context-test",
    created: function(){
        this.$on('movements-received', function(d){
            this.$broadcast('movements-received', d);
        });
        this.$on('new-movement-saved', function(d){
            this.$broadcast('new-movement-saved');
        })
    }
});

$("#item_movements_show").length > 0 ? new Vue({
    el: "#item_movements_show",
    ready: function(){
        console.log(this.item_id);
        this.fetchMovement();

    },

    data: {
        movement: {name: "Loading.."},
        item: {},
        item_id: "",
        id: "",
    },
    methods: {
        fetchMovement: function(){
            this.$http.get("/api/v1/items/" + this.item_id + "/movements/" + this.id, function(response){
                this.movement = response.movement;
                this.item = response.item;
            });
        },
     /*   fetchLastMovements: function(){
            this.$http.get("/api/v1/items/"+ this.item_id + "/movements?max=5", function(response){
                this.movements = response.movements;
            });
        },
        saveNewMovement: function(e){
            this.saving = true;
            e.preventDefault();
            this.new_movement.quantity *= this.direction;
            this.$http.post("/api/v1/items/" + this.item_id + "/movements/", this.new_movement, function(response){
                this.saving = false;
                this.movements.push(response.movement);
                this.item = response.item;

                this.item.quantity +=this.new_movement.quantity;
                this.new_movement.description = "";
                this.new_movement.reference = "";
                this.new_movement.quantity = "";
            }).error(function(d,s,r){
                // re-enable saving and call generic handler.
                this.saving = false;
                window.httpErrorHandler(d,s,r);
            });
        }*/
    }
}) : null;

var addAlert = function(message, type, delay){
    if(typeof delay == "undefined"){
        delay = 1000;
    }

    var alert = $("#alert-template").html();
    alert = alert.replace("{alert-type}", type);
    alert = alert.replace("{alert-message}", message);

    var $alert = $(alert);
    $(".overlay-alert").append($alert);

    if(delay > -1){
        window.setTimeout(function(){
            $alert.fadeOut(1000, function(){$alert.remove()});
        },delay);
    }

};

window.httpErrorHandler = function(d,s,r){
    if(!d && !s && !r) return;
    if(s == 422){
        // validation error.
        var errors = [];
        for(var failed_field in d){
            for(var i = 0; i < d[failed_field].length; i++){
                errors.push(d[failed_field][i]);
            }
        }

        if(errors.length > 0){
            addAlert("There were errors! Your change has not been saved:<br/><br/>" + errors.join("<br/>"), "danger", 5000);
        }
    }
    else{
        addAlert("HTTP error code " + s + " was thrown.", -1);
        debugger;
    }
}
//# sourceMappingURL=inventory-app.js.map
