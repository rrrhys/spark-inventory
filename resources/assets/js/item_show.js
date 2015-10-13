$("#item_show").length > 0 ? new Vue({
    el: "#item_show",
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