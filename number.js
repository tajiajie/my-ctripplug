const timer = new Date().toTimeString().slice(0, 5).replace(/[\r:]/g,'')  // 获取当前的时间
// console.log(timer)
const newMonth = new Date().getMonth() + 1
const newDate =  new Date().getDate()
const newDay = (Number(newMonth.toString() + newDate.toString())) // 当前日期
// console.log(newDay);

const getDataUrl = 'http://112.124.107.209:9090/pluginConfig/number?number=' + number
const postMessage = 'http://112.124.107.209:9090/message?number='+number

/* 接口访问 */
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            var data = JSON.parse(xhr.responseText);
            callback(data);
        }
    }
    xhr.send();
}

/* 加载页面*/
window.onload = function () {
    const url1 = 'vbooking.ctrip.com/dingzhi/GrabRequire/NewIndex'
    const url2 = 'https://vbooking.ctrip.com/dingzhi/GrabRequire/NewIndex'
    const url3 = 'http://vbooking.ctrip.com/dingzhi/GrabRequire/NewIndex'
    if (location.href == url1 || location.href == url2 || location.href == url3) {
        /* 获取本地ip*/
        getUserIP(function(ip){
            // console.log(ip)
            let nativeIP = ip.slice(0, 9)
            /* 获取指定抢单器配置信息 */
            httpRequest(getDataUrl, function(res){
                let plugin = res.data.plugin
                let pluginTimes = res.data.pluginTimes
                const canUse = plugin.canUse // 是否开启抢单器
                const ip = plugin.ip // 本机ip
                const maxItem = plugin.maxItem // 最大抢单量
                const maxMoney = plugin.maxMoney // 最多钱
                const maxPeople = plugin.maxPeople // 最多人
                const minMoney = plugin.minMoney // 最少钱
                const minPeople = plugin.minPeople // 最少人
                if (ip === '') {
                    alert('请在控制台配置ip')
                } else {
                    const intIP = ip.slice(0, 9)
                    if (nativeIP === intIP) {
                        /* 存储信息至localStorage */
                        if (!localStorage.getItem('clickNums')) {
                            localStorage.setItem('clickNums', '0')
                        }
                        if (!localStorage.getItem('allClickNum')) {
                            localStorage.setItem('allClickNum', maxItem)
                        } else if (Number(localStorage.getItem('allClickNum')) !== maxItem) {
                            localStorage.setItem('allClickNum', maxItem)
                        }
                        if (!localStorage.getItem('currentTimes')) {
                            localStorage.setItem('currentTimes', newDay)
                        } else if (Number(localStorage.getItem('currentTimes')) !== newDay) {
                            localStorage.setItem('clickNums', '0')
                            localStorage.setItem('currentTimes', newDay)
                        }
                        if (!localStorage.getItem('number')) {
                            localStorage.setItem('number', number)
                        } else if (Number(localStorage.getItem('number')) !== number) {
                            localStorage.setItem('number', number)
                        }
                        if (canUse) {
                            if (pluginTimes.length > 0) {
                                for (var i=0; i<pluginTimes.length; i++) {
                                    const pluginstartTime = pluginTimes[i]['startTime'].replace(/[\r:]/g, '')
                                    const pluginendTime = pluginTimes[i]['endTime'].replace(/[\r:]/g, '')
                                    if (pluginstartTime <= timer && timer <= pluginendTime) {

                                        let order = document.getElementById('grabOrderList').querySelectorAll('tr')

                                        if (order.length) {
                                            if (order[0].className === 'grabOrder') {
                                                let order = document.getElementById('grabOrderList').querySelectorAll('tr')
                                                // console.log('获取表格所有行')
                                                for (var i = 0; i < order.length; i++) {
                                                    const money = Number(order[i].cells[12].innerHTML.replace(/ /g, '').replace(/[\r\n]/g, ''))
                                                    const people = Number((order[i].cells[13].innerHTML.replace(/ /g, '').replace(/[\r\n]/g, '')).split('成人')[0])

                                                    if ((minMoney <= money && money <= maxMoney) || (minPeople <= people && people <= maxPeople)) {
                                                        document.getElementById('grabOrderList').querySelectorAll('tr')[i].click()
                                                        let modal = document.querySelector('.js_remindGrabOrder').querySelector('.modal-dialog').querySelector('.modal-content').querySelector('.modal-footer').querySelector('.confirmGrabOrder')
                                                        modal.click()
                                                        const getclickNum = Number(localStorage.getItem('clickNums'))
                                                        if (getclickNum <= maxItem) {
                                                            /* 滑块 */
                                                            setTimeout(function() {
                                                                let mouseLeft = $('#verification-code').offset().left + 20
                                                                let mouseTop = $('#verification-code').offset().top + 20
                                                                let mouseDown = document.createEvent('MouseEvents')
                                                                mouseDown.initMouseEvent(
                                                                    'mousedown',
                                                                    true,
                                                                    false,
                                                                    window,
                                                                    1,
                                                                    0,
                                                                    0,
                                                                    mouseLeft,
                                                                    mouseTop,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    0,
                                                                    null
                                                                )

                                                                let slide = setInterval(() => {
                                                                    if ($('.cpt-drop-btn').length === 1) {
                                                                        clearInterval(slide)
                                                                        $('.cpt-drop-btn').get(0).dispatchEvent(mouseDown)
                                                                        let mouseMove = document.createEvent('MouseEvents')
                                                                        let timer = setInterval(() => {
                                                                            let x = Math.random()*10
                                                                            mouseLeft = mouseLeft + x
                                                                            mouseMove.initMouseEvent(
                                                                                'mousemove',
                                                                                true,
                                                                                false,
                                                                                window,
                                                                                0,
                                                                                0,
                                                                                0,
                                                                                mouseLeft,
                                                                                mouseTop,
                                                                                false,
                                                                                false,
                                                                                false,
                                                                                false,
                                                                                0,
                                                                                null
                                                                            )

                                                                            $('.cpt-drop-btn').get(0).dispatchEvent(mouseMove)
                                                                            if(mouseLeft >= $('#verification-code').offset().left + 280 - 20){
                                                                                clearInterval(timer)
                                                                                /* 存点击次数 */
                                                                                let c = Number(getclickNum) + 1
                                                                                localStorage.setItem('clickNums', c)
                                                                                httpRequest(postMessage, function(res){console.log(res.msg)})
                                                                                setTimeout(function() {
                                                                                    window.location.reload()
                                                                                },1900)
                                                                            }
                                                                        }, Math.random()*10)
                                                                    }
                                                                },10)
                                                            },1200)
                                                        } else {
                                                            alert('已抢够今日所需单量')
                                                        }
                                                    } else if (i === order.length - 1) {
                                                        setTimeout(function() {
                                                            window.location.reload()
                                                        },4000)
                                                    }
                                                }
                                            } else { // 列表名字不符合
                                                window.location.reload()
                                            }
                                        } else { // 没有订单，重新获取页面
                                            window.location.reload()
                                        }
                                    }
                                }
                            } else {
                                alert('请在控制台配置抢单时间')
                            }
                        } else { // 关闭抢单器
                            alert('控制台已关闭该抢单器')
                        }
                    } else {
                        alert('当前ip不正确')
                    }
                }
            })
        })
    }
}