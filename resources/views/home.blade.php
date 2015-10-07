@extends('spark::layouts.app')

@section('content')
<!-- Main Content -->
<div class="container spark-screen">
	@if (Spark::usingTeams() && ! Auth::user()->hasTeams())

		<!-- Teams Are Enabled, But The User Doesn't Have One -->
		<div class="row">
			<div class="col-md-10 col-md-offset-1">
				<div class="panel panel-default">
					<div class="panel-heading">You Need A Team!</div>

					<div class="panel-body bg-warning">
						It looks like you haven't created a team!
						You can create one in your <a href="/settings?tab=teams">account settings</a>.
					</div>
				</div>
			</div>
		</div>

	@else

		<!-- Teams Are Disabled Or User Is On Team -->
		<div class="row">
			<div class="col-md-10 col-md-offset-1">
				<div class="panel panel-default" id="dashboard">
					<div class="panel-heading">Dashboard</div>

					<div class="panel-body">
						<div class="row">
							<div class="col-md-4">
								<div class="panel panel-info">
									<div class="panel-heading">Places</div>
									<div class="panel-body">
										<ul class="nav nav-stacked">
											<li>
												<a href="{{ route('items.index') }}">All Items</a></li>
										</ul>
									</div>
								</div></div>
							<div class="col-md-4"></div>
							<div class="col-md-4"></div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<div class="panel panel-info">
									<div class="panel-heading">Quick View</div>
									<div class="panel-body">
										<ul class="list-group">
											<li class="list-group-item"
												v-on="click: showExpectedDeliveries = !showExpectedDeliveries"
													v-class="active: showExpectedDeliveries">
												Expected Deliveries <span class="badge">@{{ expectedDeliveries.length }}</span>
											</li>
											<li class="list-group-item"
												v-repeat="expectedDeliveries"
												v-show="showExpectedDeliveries"
												>
												@{{ item_name }}
											</li>
											<li class="list-group-item"
												v-on="click: showItemsBelowMinimum = !showItemsBelowMinimum"
												v-class="active: showItemsBelowMinimum">
												Items below minimum <span class="badge">@{{ itemsBelowMinimum.length }}</span>
											</li>
											<li v-repeat="itemsBelowMinimum" v-show="showItemsBelowMinimum" class="list-group-item">
												@{{ item_name }}
											</li>
										</ul>
										<h4></h4>
										<h4></h4>
									</div>
								</div>
							</div>
							<div class="col-md-4">
								<div class="panel panel-info">
									<div class="panel-heading">By Item</div>
									<div class="panel-body">

										<div class="form-group">



											<div class="input-group" style="width:100%;">

												<input type="text" id="item-name-typeahead" class="form-control" data-provide="typeahead" v-on="change: getSelectedItem, keyup: getSelectedItem | key 'enter'" v-attr="disabled: selectedItem != ''">
												<div class="input-group-addon btn-clear-selected-item" v-if="selectedItem != ''" v-on="click: clearSelectedItem"><span class="fa fa-remove"></span></div>
											</div>
											<span class="help-block">Enter a name/ID/scan a barcode.</span>

										</div>
										<div class="btn-group-vertical" role="group" style="width:100%;">
											<button
													class="js-checkin btn btn-block btn-default btn-left"
													v-attr="disabled: selectedItem == ''"
													v-on="click: redirectToURL('/items/' + selectedItem.id + '/movements/create/in')">
												<span class="fa fa-plus"></span>
												Check In
											</button>
											<button
													class="js-checkout btn btn-block btn-default btn-left"
													v-attr="disabled: selectedItem == ''"
													v-on="click: redirectToURL('/items/' + selectedItem.id + '/movements/create/out')">
												<span class="fa fa-minus"></span>
												Check Out
											</button>
											<button
													class="js-movement-report btn btn-block btn-default btn-left"
													v-attr="disabled: selectedItem == ''"
													v-on="click: redirectToURL('/items/' + selectedItem.id + '/movements/')">
												<span class="fa fa-bar-chart"></span> Movement Report</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-4">
								<div class="panel panel-info">
									<div class="panel-heading">Feed</div>
									<div class="panel-body">


                                        <table class="table">
                                            <tr>
                                                <th>When</th>
                                                <th>Quantity</th>
                                                <th>Notes</th>
                                            </tr>
                                            <tr v-repeat="feed">
                                                <td title="@{{ created_at }}">@{{human_created_at}}</td>
                                                <td>@{{ quantity }}</td>
                                                <td>@{{ description }}</td>
                                            </tr>
                                            <tr v-if="feed.length == 0">
                                                <td colspan="42">No recent movements</td>
                                            </tr>
                                        </table>

									</div>
								</div>
							</div>
						</div>



					</div>
				</div>
			</div>
		</div>

	@endif
</div>
@endsection
