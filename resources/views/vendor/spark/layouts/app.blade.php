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
    @include('overlay-alert')

    <!-- Main Content -->
    @yield('content')

    <!-- Footer -->
    @include('spark::common.footer')

    <!-- JavaScript Application -->
    <script src="/js/app.js"></script>
    <script src="/js/requires.js"></script>
        <script src="/js/inventory-app.js"></script>
</body>
</html>
