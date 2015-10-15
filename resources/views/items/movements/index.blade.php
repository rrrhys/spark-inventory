@extends('spark::layouts.app')

@section('content')

(movements/index)

<div id="movements-list">
    <input type="hidden" name="" v-model="item_id" value="{{$item_id}}">
</div>
<script type="text/javascript">
    new Vue({
        el: "#movements-list",
        data: {
            item_id: "",
            movements: []
        },
        ready: function(){
            this.fetchMovements()
        },
        methods: {
            fetchMovements: function(){
                var url = 'api/v1/items/' + this.item_id + '/movements?page=' + page;
                this.$http.get(url, function(response){
                    this.from = response.from;
                    this.to = response.to;
                    this.total = response.total;
                    this.current_page = response.current_page;
                    this.last_page = response.last_page;
                    this.movements = response.data;
                })
            }
        }
    })
</script>
@endsection
