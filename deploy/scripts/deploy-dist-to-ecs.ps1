param(
  [string]$HostName = "47.97.56.180",
  [string]$User = "root",
  [int]$Port = 22,
  [string]$RemoteDir = "/var/www/lv-zhu-blog/current",
  [switch]$SkipUpload
)

$ErrorActionPreference = "Stop"

function Quote-Sh([string]$Value) {
  if ($Value.Contains("'")) {
    throw "Remote path must not contain a single quote: $Value"
  }

  return "'" + $Value + "'"
}

function Resolve-Tool([string]$Name, [string]$FallbackPath) {
  $Command = Get-Command $Name -ErrorAction SilentlyContinue
  if ($Command) {
    return $Command.Source
  }

  if (Test-Path -LiteralPath $FallbackPath) {
    return $FallbackPath
  }

  throw "Cannot find $Name. Enable OpenSSH Client or add $FallbackPath to PATH."
}

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$Archive = Join-Path ([System.IO.Path]::GetTempPath()) ("lv-zhu-blog-dist-{0}.tgz" -f [DateTimeOffset]::UtcNow.ToUnixTimeSeconds())
$RemoteArchive = "/tmp/lv-zhu-blog-dist.tgz"
$RemoteTarget = "{0}@{1}:{2}" -f $User, $HostName, $RemoteArchive
$RemoteLogin = "{0}@{1}" -f $User, $HostName
$SshExe = Resolve-Tool "ssh" "C:\Windows\System32\OpenSSH\ssh.exe"
$ScpExe = Resolve-Tool "scp" "C:\Windows\System32\OpenSSH\scp.exe"
$TarExe = Resolve-Tool "tar" "C:\Windows\System32\tar.exe"
$SshOptions = @("-o", "StrictHostKeyChecking=accept-new")

Push-Location $RepoRoot
try {
  npm.cmd run build

  if (Test-Path -LiteralPath $Archive) {
    Remove-Item -LiteralPath $Archive -Force
  }

  & $TarExe -C dist -czf $Archive .

  if ($SkipUpload) {
    Write-Host "Build and archive completed. Upload skipped: $Archive"
    return
  }

  & $ScpExe -P $Port @SshOptions $Archive $RemoteTarget

  $RemoteDirQuoted = Quote-Sh $RemoteDir
  $RemoteArchiveQuoted = Quote-Sh $RemoteArchive

  $RemoteScript = @(
    'set -euo pipefail'
    'if [ "$(id -u)" -eq 0 ]; then'
    '  SUDO=""'
    'else'
    '  SUDO="sudo"'
    'fi'
    '$SUDO mkdir -p ' + $RemoteDirQuoted
    '$SUDO rm -rf ' + $RemoteDirQuoted + '/*'
    '$SUDO tar -xzf ' + $RemoteArchiveQuoted + ' -C ' + $RemoteDirQuoted
    '$SUDO chown -R www-data:www-data ' + $RemoteDirQuoted + ' 2>/dev/null || $SUDO chown -R nginx:nginx ' + $RemoteDirQuoted + ' 2>/dev/null || true'
    '$SUDO nginx -t'
    '$SUDO systemctl reload nginx 2>/dev/null || $SUDO service nginx reload'
    'rm -f ' + $RemoteArchiveQuoted
  ) -join "`n"

  $RemoteScript | & $SshExe -p $Port @SshOptions $RemoteLogin "bash -s"
}
finally {
  Pop-Location
  if (Test-Path -LiteralPath $Archive) {
    Remove-Item -LiteralPath $Archive -Force
  }
}
