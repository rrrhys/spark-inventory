google.load('visualization', '1', {packages: ['corechart', 'line']});

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
            });
        },

        fetchTypeaheadItems: function(){
            this.$http.get('/api/v1/items/?perPage=10000', function(response){
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
        }
    },
    props: ['passed_direction', 'passed_id'],
    ready: function(){
        this.direction = this.passed_direction;
        this.item_id = this.passed_id;
        this.fetchItem();
        this.fetchLastMovements();


    },
    methods: {
        fetchItem: function(){
            this.$http.get("/api/v1/items/" + this.item_id, function(response){
                this.item = response.item;
            });
        },
        fetchLastMovements: function(){
            this.$http.get("/api/v1/items/"+ this.item_id + "/movements?perPage=5", function(response){
                this.movements = response.data;
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
        }
    }
});

Vue.component('item-show', {
    template: document.querySelector("#item-show-template"),
    data: function () {
        return {
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
        }
    },
    props: ['passed_item_id'],
    ready: function(){
        this.item_id = this.passed_item_id;
        this.fetchItem();
        this.fetchLastMovements();

    },
    methods: {
        fetchItem: function(){
            this.$http.get("/api/v1/items/" + this.item_id, function(response){
                this.item = response.item;
            });
        },
        fetchLastMovements: function(){
            this.$http.get("/api/v1/items/"+ this.item_id + "/movements?perPage=50", function(response){
                this.movements = response.data;
                this.loadChart(response.data);



            });
        },
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
            for(var i = 0; i < movement_data.length; i++){
                var row = [new moment(movement_data[i].created_at).toDate(), movement_data[i].result_quantity, this.item.minimum_level];
                chart_data.push(row);
            }
            data.addRows(chart_data);

            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(data, options);


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

new Vue({
    el: "#context-test"
});
