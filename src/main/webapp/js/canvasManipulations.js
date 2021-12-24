const cv = document.getElementById("graph");
const cx = cv.getContext("2d");
const w = cv.width;
const h = cv.height;
const scale = 5;
const unit = (h / (2*scale))*0.9;
var globalX;
var globalR;
var dots = new Array();

//если r уже установлено, то функция нажимает на нужную кнопку x, вводит значение в поле y, сохраняет x в globalX
function setCoordinates(x, y) {
    if (isRSet()){
        setX(x);
        setY(y);
        return true;
    } else {
        $('#r-error').css({"visibility":"visible"});
        return false;
    }
}
//установка R
function setR(r) {
    if(typeof globalR != "undefined" && document.getElementById('form:r'+globalR).classList.contains("clicked_button")){
        document.getElementById('form:r'+globalR).classList.toggle('clicked_button');
    }
    globalR = r;
    document.getElementById("form:r").value = r;
    document.getElementById('form:r'+r).classList.toggle('clicked_button');
    $('#r-error').css({"visibility":"hidden"});
    redraw();
}
//валидация y, ввод значения в поле
function setY(y){
    if (y<-5){
        y=-5;
    }else if(y>3){
        y=3;
    }
    document.getElementById("form:y").value = y.toFixed(3);
}
//валидация x, выбор нужной кнопки
function setX(x) {
    let arrayOfx = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
    let res;
    if (x<-2){
        res=-2;
    }else if(x>2){
        res=2;
    } else {
        res = arrayOfx[0];
        for (const i of arrayOfx) {
            if (Math.abs(i-x)<Math.abs(res-x)){
                res = i;
            }
        }
    }
    document.getElementById("form:x").value = res;
}
//проверка, выбрано ли r
function isRSet(){
    /*return Number($("select.rvalues").children("option:selected").val()) > 0;*/
    if ((typeof globalR) !='undefined' &&  globalR>0){
        return true;
    }
    return false;
}
//функция возвращает сохраненное значение R
function getSavedR(){
    return document.getElementById("form:r").value;
}
//восстанавливает R
function reviveR(){
    if (typeof (getSavedR())!="undefined"){
        setR(getSavedR());
    }
}
//перерисовка таблицы, canvas
function update(){
    reviveR();
    dots = new Array();
    retrieveDots();
    redraw();
    $('#r-error').css({"visibility":"hidden"});
}
//отрисовка фигуры при загрузке страницы
$(document).ready(function () {
    update();
})
//достаём значения из таблицы
function retrieveDots() {
    let rows = document.getElementById("myTable").rows;
    if (rows.length>1){
        for(let i = 1; i<rows.length; i++){
            let cells = rows[i].cells;
            if (cells[0].innerHTML.trim().length == 0){continue;}
            dots.push({
                x: cells[0].innerHTML.trim(),
                y: cells[1].innerHTML.trim(),
                res: cells[3].innerHTML.trim()
            });
        }
    }
    console.log(dots);
}
//мы определяем координаты клика на canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: convertXtoUnits(evt.clientX - rect.left),
        y: convertYtoUnits(evt.clientY - rect.top)
    };
}
//в силу масштабируемости окна нужно конвертировать x в реальное значение
function convertXtoUnits(x1){
    let localWidth = document.getElementById("graph").clientWidth;
    return (x1 - localWidth/2)/( localWidth * 0.9/ (2*scale));
}
//в силу масштабируемости окна нужно конвертировать y в реальное значение
function convertYtoUnits(y1){
    let localHeight = document.getElementById("graph").clientHeight;
    return (localHeight/2 - y1)/(localHeight * 0.9 / (2*scale));
}
//при клике по canvas определяем координаты и устанавливаем
cv.addEventListener('click', function(evt) {
    var mousePos = getMousePos(cv, evt);
    let isSet = setCoordinates(mousePos.x, mousePos.y);
    if (isSet){document.getElementById('form:submit-button').click();}
}, false);
//отрисовка всего
function redraw(){
    let r;
    const x0 = w/2;
    const y0 = h/2;
    if (isRSet()){
        /*r = Number($("select.rvalues").children("option:selected").val());*/
        r = globalR;
    } else{
        r = 0;
    }
    clear();
    r*=unit;
    cx.fillStyle = "#3398fd";
    cx.beginPath();
    cx.moveTo(x0 + r/2, y0);
    cx.lineTo(x0, y0-r);
    cx.lineTo(x0, y0);
    cx.fill();

    cx.beginPath();
    cx.moveTo(x0 - r, y0);
    cx.lineTo(x0 - r, y0 - r/2);
    cx.lineTo(x0, y0 - r/2);
    cx.lineTo(x0, y0);
    cx.fill();

    cx.beginPath();
    cx.arc(x0, y0, r/2, Math.PI * 1/2 , Math.PI);
    cx.lineTo(x0, y0);
    cx.fill();

    drawGrid(cx, x0, y0);
    drawAllDots();
}
//заливаем canvas белым (это фон коорд. плоскости)
function clear(){
    cx.fillStyle = "#FFFFFF";
    cx.beginPath();
    cx.moveTo(0, 0);
    cx.lineTo(0, h);
    cx.lineTo(w, h);
    cx.lineTo(w, 0);
    cx.fill();
}
//чертим оси x, y
function drawGrid(cx, x, y) {
    cx.fillStyle = "#000000";
    cx.beginPath();
    cx.moveTo(0, y);
    cx.lineTo(2*x, y);
    cx.moveTo(x, 0);
    cx.lineTo(x, 2*y);
    cx.closePath();
    cx.stroke();
    cx.font = '20px serif';
    //проставляем числа над осями
    for (let i = -scale; i<=scale; i++){
        if (i<=0){
            cx.fillText(i, x+i*unit-10, y+15);
        }else {
            cx.fillText(i, x+i*unit-5, y+15);
        }
        if(i===0){continue;}
        cx.fillText(i, x+2, y-i*unit+5);
    }
}
//чертим выбранные точки
function drawAllDots() {
    for (let index = 0; index < dots.length; ++index) {
        drawADot(dots[index]);
    }
}
//чертит точку
function drawADot(dot){
    let dotX = dot.x*unit + w/2;
    let dotY = h/2 - dot.y*unit;
    if (dot.res.includes("true")){
        cx.fillStyle = "#0fee3c";
    }else {
        cx.fillStyle = "#ee0f22";
    }

    cx.beginPath();
    cx.arc(dotX, dotY, 2.8, 0 , Math.PI * 2);
    cx.fill();
}