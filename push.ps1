# 多仓库推送
git pull
Write-Output "===========拉取完成==========="
git push jihulab
Write-Output "===========推送jihulab完成==========="
git push gitee
Write-Output "===========推送gitee完成==========="
git push
Write-Output "===========推送github完成==========="