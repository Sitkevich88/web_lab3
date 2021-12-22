//блокирую ввод недопустимых значений в поле y
$(".check_me").keypress(function(e) {
    var txt = String.fromCharCode(e.which);
    if (!txt.match(/[0-9&.-]/)) {
        return false;
    }
});