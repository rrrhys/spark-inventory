<!DOCTYPE html>
<html lang="en">
<head>
    @include('spark::layouts.common.head')

    @include('head')

</head>
<body>
    <!-- Navigation -->
    @if (Auth::check())
        @include('spark::nav.authenticated')
    @else
        @include('spark::nav.guest')
    @endif

    <!-- Main Content -->
    @yield('content')

    <!-- Footer -->
    @include('spark::common.footer')

    <!-- JavaScript Application -->
    <script src="/js/app.js"></script>
        <script src="/js/inventory.js"></script>
</body>
</html>
