Start-Process -FilePath "http://127.0.0.1:40000/"
$env:NODE_OPTIONS = "--openssl-legacy-provider"
npm run serve
