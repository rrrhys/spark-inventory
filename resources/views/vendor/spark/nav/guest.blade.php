<nav class="navbar navbar-default">
	<div class="container">
		<div class="navbar-header">

			<!-- Collapsed Hamburger -->
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only">Toggle Navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>

			<!-- Branding Image -->
			<a class="navbar-brand" href="/" style="padding-top: 14px;">
				<i class="fa fa-btn {{Config::get('saas.icon')}}"></i>{{Config::get('saas.name')}}
			</a>
		</div>

		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<!-- Left Side Of Navbar -->
			<ul class="nav navbar-nav">
				<li><a href="/">Home</a></li>
			</ul>

			<!-- Right Side Of Navbar -->
			<ul class="nav navbar-nav navbar-right">
				<!-- Login / Registration Links -->
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			</ul>
		</div>
	</div>
</nav>
