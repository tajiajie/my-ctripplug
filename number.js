console.log('进入抢单器')

let WinAlert = window.alert;
window.alert = function (e) {
    if (e != null && e.indexOf("您的操作太频繁！") > -1) { }
    else {
        WinAlert(e);
    }
}
// const timer = new Date().toTimeString().slice(0, 5).replace(/[\r:]/g,'')  // 获取当前的时间
// console.log(timer)
const newMonths = new Date().getMonth() + 1
const newDate =  new Date().getDate()
const newDay = (Number(newMonths.toString() + newDate.toString())) // 当前日期
// console.log(newDay);

const getDataUrl = 'http://112.124.107.209:9090/pluginConfig/number?number=' + number
const postMessage = 'http://112.124.107.209:9090/message?number=' + number
let nativeIP

/* 接口访问 */
function httpRequest(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4){
            let data = JSON.parse(xhr.responseText);
            callback(data);
        }
    }
    xhr.send();
}

/* 加载页面 */
window.onload = function () {
    console.log('加载页面完成')
    const url1 = 'vbooking.ctrip.com/dingzhi/GrabRequire/NewIndex'
    const url2 = 'https://vbooking.ctrip.com/dingzhi/GrabRequire/NewIndex'
    const url3 = 'http://vbooking.ctrip.com/dingzhi/GrabRequire/NewIndex'
    if (location.href === url1 || location.href === url2 || location.href === url3) {
        /* 获取本地ip*/
        // console.log('进入携程')
        getUserIP(function(ip) {
            console.log(ip)
            nativeIP = ip.split('.')[0] + '.' + ip.split('.')[1]
            /* 获取指定抢单器配置信息 */
            main()
            setInterval(main, 300000)
        })
    }
}

function main() {
    httpRequest(getDataUrl, function(res){
        if (res.code === 200) {
            console.log(res.data)
            let plugin = res.data.plugin
            let pluginTimes = res.data.pluginTimes
            const canUse = plugin.canUse // 是否开启抢单器
            const getip = plugin.ip // 本机ip
            const maxItem = plugin.maxItem // 最大抢单量
            const maxMoney = plugin.maxMoney // 最多钱
            const maxPeople = plugin.maxPeople // 最多人
            const minMoney = plugin.minMoney // 最少钱
            const minPeople = plugin.minPeople // 最少人
            const logic = plugin.logicalRelationship // 逻辑   0是或；1为与
            const start = plugin.minStartDate // 日期开始
            const end = plugin.maxStartDate // 日期截止
            if (getip === '') {
                alert('请在控制台配置ip')
            } else {
                let arrIp = []
                arrIp = getip.split('/')
                if (arrIp.indexOf(nativeIP) >= 0) {
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
                            for (let i=0; i<pluginTimes.length; i++) {
                                // console.log(i + '循环')
                                let pluginstartTime = pluginTimes[i]['startTime'].replace(/[\r:]/g, '')
                                let pluginendTime = pluginTimes[i]['endTime'].replace(/[\r:]/g, '')

                                let timer = new Date().toTimeString().slice(0, 5).replace(/[\r:]/g,'') // 当前时间
                                console.log(timer)
                                if (pluginstartTime <= timer && timer <= pluginendTime) {

                                    function orderList() {
                                        let order = document.getElementById('grabOrderList').querySelectorAll('tr')
                                        if (order.length && order[0].className !== 'grabOrder') {
                                            console.log('11111列表')
                                            setTimeout(orderList, 5)
                                        } else if (order.length && order[0].className === 'grabOrder') {
                                            console.log('22222列表')
                                            let order = document.getElementById('grabOrderList').querySelectorAll('tr')

                                            let litsIndex = ''
                                            for (var j = 0; j < order.length; j++) {
                                                const money = Number(order[j].cells[12].innerText)
                                                const people = Number((order[j].cells[13].innerText).split('成人')[0])

                                                /**/
                                                if (start === null) {
                                                    console.log('null')
                                                    if (logic === 0) {
                                                        if ((minMoney <= money && money <= maxMoney) || (minPeople <= people && people <= maxPeople)) {
                                                            console.log(j)
                                                            console.log(people + '成人')
                                                            litsIndex = j
                                                            break;
                                                        } else if (j === order.length - 1) {
                                                            console.log(j, '无符合项')
                                                            setTimeout(function() {
                                                                window.location.reload()
                                                            }, 3000)
                                                        }
                                                    } else {
                                                        if ((minMoney <= money && money <= maxMoney) && (minPeople <= people && people <= maxPeople)) {
                                                            console.log(j)
                                                            console.log(people + '成人')
                                                            litsIndex = j
                                                            break;
                                                        } else if (j === order.length - 1) {
                                                            console.log(j, '无符合项')
                                                            setTimeout(function() {
                                                                window.location.reload()
                                                            }, 3000)
                                                        }
                                                    }
                                                } else {
                                                    console.log('11111111111')
                                                    let listDateMonth = order[j].cells[11].innerText.split('-')[0]
                                                    let newMonth = new Date().getMonth() + 1 // 当前月
                                                    let listDate
                                                    if (newMonth > listDateMonth) {
                                                        listDate = (new Date().getFullYear() + 1) + '-' + order[j].cells[11].innerText.split('至')[0]
                                                    } else {
                                                        listDate = new Date().getFullYear() + '-' + order[j].cells[11].innerText.split('至')[0]
                                                    }
                                                    console.log(start)
                                                    console.log(listDate)
                                                    console.log(end)
                                                    let oDate1 = new Date(start);
                                                    let oDate2 = new Date(end);
                                                    let oDate3 = new Date(listDate);
                                                    if(oDate1.getTime() <= oDate3 && oDate3 <= oDate2.getTime()){
                                                        console.log('在在在');
                                                        if (logic === 0) {
                                                            if ((minMoney <= money && money <= maxMoney) || (minPeople <= people && people <= maxPeople)) {
                                                                console.log(j)
                                                                console.log(people + '成人')
                                                                litsIndex = j
                                                                break;
                                                            } else if (j === order.length - 1) {
                                                                console.log(j, '无符合项')
                                                                setTimeout(function() {
                                                                    window.location.reload()
                                                                }, 3000)
                                                            }
                                                        } else {
                                                            if ((minMoney <= money && money <= maxMoney) && (minPeople <= people && people <= maxPeople)) {
                                                                console.log(j)
                                                                console.log(people + '成人')
                                                                litsIndex = j
                                                                break;
                                                            } else if (j === order.length - 1) {
                                                                console.log(j, '无符合项')
                                                                setTimeout(function() {
                                                                    window.location.reload()
                                                                }, 3000)
                                                            }
                                                        }
                                                    } else {
                                                        console.log('不在');
                                                        if (j === order.length - 1) {
                                                            console.log(j, '无符合项')
                                                            setTimeout(function() {
                                                                window.location.reload()
                                                            }, 3000)
                                                        }
                                                    }
                                                }
                                                /**/

                                            }
                                            if (litsIndex !== '') {
                                                console.log('是是是' + j)
                                                document.getElementById('grabOrderList').querySelectorAll('tr')[j].click()
                                                let modal = document.querySelector('.js_remindGrabOrder').querySelector('.modal-dialog').querySelector('.modal-content').querySelector('.modal-footer').querySelector('.confirmGrabOrder')
                                                modal.click()
                                                const getclickNum = Number(localStorage.getItem('clickNums'))
                                                if (getclickNum <= maxItem) {
                                                    /* 滑块 */
                                                    function btn() {
                                                        if ($('.cpt-drop-btn').length === 0) {
                                                            console.log('滑块')
                                                            setTimeout(btn, 5)
                                                        } else if ($('.cpt-drop-btn').length === 1) {
                                                            console.log('滑块1111')
                                                            let mouseLeft = $('#verification-code').offset().left + Math.floor(Math.random()*30 + 5)
                                                            let mouseTop = $('#verification-code').offset().top + Math.floor(Math.random()*30 + 5)
                                                            let mouseDown = document.createEvent('MouseEvents')
                                                            mouseDown.initMouseEvent(
                                                                'mousedown',
                                                                true,
                                                                true,
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

                                                            $('.cpt-drop-btn').get(0).dispatchEvent(mouseDown)
                                                            let mouseMove = document.createEvent('MouseEvents')
                                                            function slide() {
                                                                let x = Math.random()*15
                                                                mouseLeft = mouseLeft + x
                                                                mouseMove.initMouseEvent(
                                                                    'mousemove',
                                                                    true,
                                                                    true,
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
                                                                if(mouseLeft < $('#verification-code').offset().left + 300 - 20){
                                                                    console.log('滑块滑动中·······')
                                                                    setTimeout(slide, Math.random()*10)
                                                                } else if (mouseLeft >= $('#verification-code').offset().left + 300 - 20) {
                                                                    /* 存点击次数 */
                                                                    console.log('滑块结束！！！')
                                                                    let c = Number(getclickNum) + 1
                                                                    localStorage.setItem('clickNums', c)
                                                                    httpRequest(postMessage, function(res){console.log(res.msg)})

                                                                    setTimeout(function() {
                                                                        window.location.reload()
                                                                    },1900)
                                                                }
                                                            }
                                                            setTimeout(slide, Math.random()*10)
                                                        }
                                                    }
                                                    setTimeout(btn, 5)
                                                } else {
                                                    alert('已抢够今日所需单量')
                                                }
                                            }
                                        } else {
                                            console.log('无列表')
                                            setTimeout(function() {
                                                window.location.reload()
                                            }, 3000)
                                        }
                                    }
                                    setTimeout(orderList, 5)
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
        } else {
            alert('获取配置失败')
        }
    })
}


