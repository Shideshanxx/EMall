'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _payment        = require('service/payment-service.js');
var templateIndex   = require('./index.string');

// page 逻辑部分
var page = {
    data: {
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
    },
    onLoad : function(){
        this.loadPaymentInfo();
    },
    // 加载订单支付信息
    loadPaymentInfo: function(){
        var _this        = this,
            paymentlHtml = '',
            $pageWrap     = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber, function(res){
            // 渲染html
            var paymentHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">'+ errMsg +'</p>');
        });
    },
    //监听订单支付状态
    listenOrderStatus : function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNumber,function(res){
                if(res == true){
                    window.location.href = 
                    './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
                }
            },function(errMsg){

            })
        },5000)
    }
};
$(function(){
    page.init();
});