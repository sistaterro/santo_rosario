@echo off
setlocal

set "ANDROID_PREFS_ROOT="

set "LOCAL_JBR=%LOCALAPPDATA%\Packages\Microsoft.4297127D64EC6_8wekyb3d8bbwe\LocalCache\Local\runtime\java-runtime-delta\windows-x64\java-runtime-delta"
if exist "%LOCAL_JBR%\bin\java.exe" (
  set "JAVA_HOME=%LOCAL_JBR%"
)

call npm.cmd run sync
if errorlevel 1 exit /b %errorlevel%

call npm.cmd run assets
if errorlevel 1 exit /b %errorlevel%

pushd android
call gradlew.bat assembleDebug
set "BUILD_RESULT=%errorlevel%"
popd
if not "%BUILD_RESULT%"=="0" exit /b %BUILD_RESULT%

if not exist app-download mkdir app-download
copy /Y android\app\build\outputs\apk\debug\app-debug.apk app-download\santo_rosario.apk
if errorlevel 1 exit /b %errorlevel%

echo APK copied to app-download\santo_rosario.apk
