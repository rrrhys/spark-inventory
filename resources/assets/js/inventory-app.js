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



Vue.component('coupon', {
    template: document.querySelector("#coupon-template")
});


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
            {id:'item_name', name:"Name", click: function(a,b,c){
                debugger;
                this.redirectToURL('/items/' + item.id);
            } },
            {id:'client_name', name:"Client" },
            {id:'item_code', name:"Code" },
            {id:'quantity', name:"Quantity" },
            {id:'minimum_level', name:"Minimum Level" },
            {id:'created_at', name:"Created" }]
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
        },
        editItem: function(item, e){
            var i = item;

        }
    }

}) :  null;


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


var abc = function(){
}

/* =============================================================
 * bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2014 Bass Jobsen @bassjobsen
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


(function (root, factory) {

  'use strict';

  // CommonJS module is defined
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('jquery'));
  }
  // AMD module is defined
  else if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      return factory ($);
    });
  } else {
    factory(root.jQuery);
  }

}(this, function ($) {

  'use strict';
  // jshint laxcomma: true


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.select = this.options.select || this.select;
    this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.render = this.options.render || this.render;
    this.updater = this.options.updater || this.updater;
    this.displayText = this.options.displayText || this.displayText;
    this.source = this.options.source;
    this.delay = this.options.delay;
    this.$menu = $(this.options.menu);
    this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
    this.shown = false;
    this.listen();
    this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' ? this.options.showHintOnFocus : false;
    this.afterSelect = this.options.afterSelect;
    this.addItem = false;
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
      var val = this.$menu.find('.active').data('value');
      this.$element.data('active', val);
      if(this.autoSelect || val) {
        var newVal = this.updater(val);
        this.$element
          .val(this.displayText(newVal) || newVal)
          .change();
        this.afterSelect(newVal);
      }
      return this.hide();
    },

    updater: function (item) {
      return item;
    },

    setSource: function (source) {
      this.source = source;
    },

    show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      }), scrollHeight;

      scrollHeight = typeof this.options.scrollHeight == 'function' ?
          this.options.scrollHeight.call() :
          this.options.scrollHeight;

      (this.$appendTo ? this.$menu.appendTo(this.$appendTo) : this.$menu.insertAfter(this.$element))
        .css({
          top: pos.top + pos.height + scrollHeight
        , left: pos.left
        })
        .show();

      this.shown = true;
      return this;
    },

    hide: function () {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function (query) {
      var items;
      if (typeof(query) != 'undefined' && query !== null) {
        this.query = query;
      } else {
        this.query = this.$element.val() ||  '';
      }

      if (this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      var worker = $.proxy(function() {

        if($.isFunction(this.source)) this.source(this.query, $.proxy(this.process, this));
        else if (this.source) {
          this.process(this.source);
        }
      }, this);

      clearTimeout(this.lookupWorker);
      this.lookupWorker = setTimeout(worker, this.delay);
    },

    process: function (items) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length && !this.options.addItem) {
        return this.shown ? this.hide() : this;
      }

      if (items.length > 0) {
        this.$element.data('active', items[0]);
      } else {
        this.$element.data('active', null);
      }

      // Add item
      if (this.options.addItem){
        items.push(this.options.addItem);
      }

      if (this.options.items == 'all') {
        return this.render(items).show();
      } else {
        return this.render(items.slice(0, this.options.items)).show();
      }
    },

    matcher: function (item) {
    var it = this.displayText(item);
      return ~it.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item;

      while ((item = items.shift())) {
        var it = this.displayText(item);
        if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
        else if (~it.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function (item) {
          var html = $('<div></div>');
          var query = this.query;
          var i = item.toLowerCase().indexOf(query.toLowerCase());
          var len, leftPart, middlePart, rightPart, strong;
          len = query.length;
          if(len === 0){
              return html.text(item).html();
          }
          while (i > -1) {
              leftPart = item.substr(0, i);
              middlePart = item.substr(i, len);
              rightPart = item.substr(i + len);
              strong = $('<strong></strong>').text(middlePart);
              html
                  .append(document.createTextNode(leftPart))
                  .append(strong);
              item = rightPart;
              i = item.toLowerCase().indexOf(query.toLowerCase());
          }
          return html.append(document.createTextNode(item)).html();
    },

    render: function (items) {
      var that = this;
      var self = this;
      var activeFound = false;
      items = $(items).map(function (i, item) {
        var text = self.displayText(item);
        i = $(that.options.item).data('value', item);
        i.find('a').html(that.highlighter(text));
        if (text == self.$element.val()) {
            i.addClass('active');
            self.$element.data('active', item);
            activeFound = true;
        }
        return i[0];
      });

      if (this.autoSelect && !activeFound) {
        items.first().addClass('active');
        this.$element.data('active', items.first().data('value'));
      }
      this.$menu.html(items);
      return this;
    },

    displayText: function(item) {
      return item.name || item;
    },

    next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    },

    prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    },

    listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },

    destroy : function () {
      this.$element.data('typeahead',null);
      this.$element.data('active',null);
      this.$element
        .off('focus')
        .off('blur')
        .off('keypress')
        .off('keyup');

      if (this.eventSupported('keydown')) {
        this.$element.off('keydown');
      }

      this.$menu.remove();
    },

    eventSupported: function(eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function (e) {
      if (!this.shown) return;

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          // with the shiftKey (this is actually the left parenthesis)
          if (e.shiftKey) return;
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          // with the shiftKey (this is actually the right parenthesis)
          if (e.shiftKey) return;
          e.preventDefault();
          this.next();
          break;
      }
    },

    keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
      if (!this.shown && e.keyCode == 40) {
        this.lookup();
      } else {
        this.move(e);
      }
    },

    keypress: function (e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
        case 13: // enter
          if (!this.shown) return;
          this.select();
          break;

        case 27: // escape
          if (!this.shown) return;
          this.hide();
          break;
        default:
          this.lookup();
      }

      e.preventDefault();
   },

   focus: function (e) {
      if (!this.focused) {
        this.focused = true;
        if (this.options.showHintOnFocus) {
          this.lookup('');
        }
      }
    },

    blur: function (e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click: function (e) {
      e.preventDefault();
      this.select();
      this.$element.focus();
    },

    mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    },

    mouseleave: function (e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    }

  };


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
	var arg = arguments;
     if (typeof option == 'string' && option == 'getActive') {
        return this.data('active');
     }
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option;
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
      if (typeof option == 'string') {
        if (arg.length > 1) {
          data[option].apply(data, Array.prototype.slice.call(arg ,1));
        } else {
          data[option]();
        }
      }
    });
  };

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>'
  , item: '<li><a href="#" role="option"></a></li>'
  , minLength: 1
  , scrollHeight: 0
  , autoSelect: true
  , afterSelect: $.noop
  , addItem: false
  , delay: 0
  };

  $.fn.typeahead.Constructor = Typeahead;


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    $this.typeahead($this.data());
  });

}));

//# sourceMappingURL=inventory-app.js.map
