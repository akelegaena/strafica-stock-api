<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Strafrica Stock</title>

    @viteReactRefresh
    @vite([
        'resources/js/app.css',
        'resources/js/index.jsx'
    ])
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: '#052a49'
                    }
                }
            }
        }
    </script>
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
    <div id="root"></div>
</body>
</html>
