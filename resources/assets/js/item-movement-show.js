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