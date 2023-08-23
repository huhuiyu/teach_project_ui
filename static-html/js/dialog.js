let openDialog = document.getElementById('openDialog');
let dialog = document.getElementById('dialog');
let divInfo = document.getElementById('divInfo');

openDialog.addEventListener('click', () => {
  divInfo.innerHTML = new Date().getTime();
  dialog.showModal();
});

dialog.addEventListener('close', () => {
  console.log('对话框关闭');
});

btnOther.addEventListener('click', () => {
  divInfo.innerHTML = new Date().getTime();
  document.getElementById('otherDialog').showModal();
});
