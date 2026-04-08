# Repack zuhaowaibao + admin-ui + ZhuHaoXiTong into Desktop\800\部署
# Run from any cwd:  powershell -ExecutionPolicy Bypass -File ...\_pack-deploy.ps1
$ErrorActionPreference = 'Stop'
$base = 'C:\Users\15585\Desktop\800'
$deploy = Join-Path $base '部署'

New-Item -ItemType Directory -Force -Path $deploy | Out-Null

# Includes pre-built: zuhaowaibao/target/*.jar and front-end dist dirs
$robos = @(
    @('zuhaowaibao', @('/XD', 'node_modules', '.git', '.idea')),
    @('admin-ui', @('/XD', 'node_modules', '.git', '.idea', '/XF', 'dist.rar')),
    @('ZhuHaoXiTong', @('/XD', 'node_modules', '.git', '.idea', '_docx_extract', '_docx_extract2', '_docx_tmp', '/XF', 'dist.rar', '_req.zip', '_docx_tmp.zip'))
)

foreach ($item in $robos) {
    $name = $item[0]
    $extra = $item[1]
    $src = Join-Path $base $name
    $dst = Join-Path $deploy $name
    if (-not (Test-Path $src)) { throw "Missing: $src" }
    $cmd = "robocopy `"$src`" `"$dst`" /E /R:1 /W:1 /NFL /NDL /NJH /NJS $($extra -join ' ')"
    cmd /c $cmd | Out-Null
    $rc = $LASTEXITCODE
    # robocopy: 0~7 成功；8+ 失败
    if ($rc -ge 8) { throw "robocopy $name failed exit $rc" }
}

$pom = Join-Path $deploy 'zuhaowaibao\pom.xml'
if (-not (Test-Path $pom)) { throw "Pack zuhaowaibao incomplete: missing $pom" }
$jar = Join-Path $deploy 'zuhaowaibao\target\ZuHao-0.0.1-SNAPSHOT.jar'
if (-not (Test-Path $jar)) {
    Write-Warning "Missing JAR, run mvnw package in zuhaowaibao: $jar"
}

# 勿将本机 admin 秘钥发给同事
Remove-Item -LiteralPath (Join-Path $deploy 'admin-ui\.env') -Force -ErrorAction SilentlyContinue

$tpl = Join-Path $PSScriptRoot '部署说明-打包.txt'
$readme = Join-Path $deploy '部署说明.txt'
if (Test-Path $tpl) {
    Copy-Item -LiteralPath $tpl -Destination $readme -Force
}

Write-Host "OK: $deploy"
