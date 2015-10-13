
// todo: Adding a blank item this way is silly.
$("#list-items").length > 0 ? new Vue({
    el: "#list-items",

    data: {
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
            {id:'item_name', name:"Name", index: 0 },
            {id:'client_name', name:"Client", index: 1 },
            {id:'item_code', name:"Code", index: 2 },
            {id:'quantity', name:"Quantity", index: 3 },
            {id:'minimum_level', name:"Minimum Level", index: 4 },
            {id:'created_at', name:"Created", index: 5 }]
    },

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
            })
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
                ta.typeahead({
                    source:data.clients,
                });

                var ta = $("#client-filter-typeahead");
                ta.typeahead({
                    source:data.clients,
                });

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
        }
    }

}) :  null;