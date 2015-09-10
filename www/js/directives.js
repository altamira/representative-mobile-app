'use strict';
angular.module('starter.directives', [])

/* Directives */
.directive('imageConvert', function() {
    return function(scope, elm, attrs) {

        elm.bind('change', function() {
            if (this.files && this.files[0]) {
                var FR = new FileReader();
                var allowedFileType = ["jpg", "jpeg", "png", "gif"];
                var filetype = this.files[0].type.split('/');
                if ($.inArray(filetype[1], allowedFileType) >= 0)
                {
                    var imagename = this.files[0].name;
                    FR.onload = function(e) {

                        document.getElementById("img").src = '';
                        if (document.getElementById("img").src = e.target.result)
                        {
                            document.getElementById("img").style.width = 'auto';
                            setTimeout(function() {
                                if (document.getElementById("img").clientWidth > 1024)
                                {
                                    document.getElementById("img").style.width = '100%';
                                }
                            }, 500);
                        }
                        document.getElementById("uploadedImg").style.display = 'block';
                        document.getElementById("img").style.display = 'inline-block';
                        document.getElementById("removeBtn").style.display = 'block';
                        document.getElementById("removeBtn1").style.display = 'block';
                        document.getElementById("uploadBtn").style.display = 'none';
                        document.getElementById("removeBtn").style.display = 'block';
                        var base64string = e.target.result.split(',');

                        scope.$apply(function() {
                            scope.operationData.format = base64string[0];
                            scope.operationData.sketch = base64string[1];
                            scope.operationData.filename = imagename;
                            scope.operationData.filetype = filetype[1];
                            scope.uploadSketch();
                        });
                    };
                    FR.readAsDataURL(this.files[0]);
                }
            }
        });

    }
})

.directive('base64ToImage', function() {
    return function(scope, elm, attrs) {

        document.getElementById("uploadedImg").style.display = 'block';
        document.getElementById("img").style.display = 'none';
        document.getElementById("removeBtn").style.display = 'block';
        document.getElementById("removeBtn1").style.display = 'block';
        document.getElementById("uploadBtn").style.display = 'none';
        document.getElementById("removeBtn").style.display = 'block';
        var newImage = new Image();
        newImage.id = 'newImg';
        newImage.src = scope.operationData.format + ',' + scope.operationData.sketch;
        document.getElementById("uploadedImg").appendChild(newImage);
        setTimeout(function() {
            if (document.getElementById("newImg").clientWidth > 1024)
            {
                document.getElementById("newImg").style.width = '100%';
            }
        }, 500);
    }
})

.directive('cancelUpdateUpload', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            document.getElementById("uploadedImg").style.display = 'none';
            document.getElementById("removeBtn").style.display = 'none';
            document.getElementById("removeBtn1").style.display = 'none';
            document.getElementById("newImg").style.display = 'none';
            document.getElementById("uploadBtn").style.display = 'block';
            document.getElementById("base").value = '';
            document.getElementById("format").value = '';
            document.getElementById("filename").value = '';
            document.getElementById("filetype").value = '';
            document.getElementById("img").removeAttribute('src');
            document.getElementById("img").style.width = 'auto';

            var image_x = document.getElementById('newImg');
            image_x.parentNode.removeChild(image_x);
            scope.$apply(function() {
                scope.operationData.sketch = '';
                scope.operationData.format = '';
                scope.operationData.filename = '';
                scope.operationData.filetype = '';
            });
        });
    }
})

.directive('cancelUpload', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            document.getElementById("uploadedImg").style.display = 'none';
            document.getElementById("removeBtn").style.display = 'none';
            document.getElementById("removeBtn1").style.display = 'none';
            document.getElementById("uploadBtn").style.display = 'block';
            document.getElementById("base").value = '';
            document.getElementById("img").removeAttribute('src');
            document.getElementById("img").style.width = 'auto';
        });
    }
})

.directive('sortList', function() {
    return function(scope, elm, attrs) {
        var elems = $('.processList').children('li').remove();
        elems.sort(function(a, b) {
            return parseInt(a.id) > parseInt(b.id);
        });
        $('.processList').append(elems);
    }
})

.directive('confirmationNeeded', function() {
    return {
        priority: 1,
        terminal: true,
        link: function(scope, element, attr) {
            var msg = attr.confirmationNeeded || "Tem certeza ?";
            var clickAction = attr.ngClick;
            element.bind('click', function() {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
})

.directive('toggleClass', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
        });
    }
})

.directive('reportToggle', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            if (elm.hasClass('fa-check-square-o') == false)
            {
                scope.pushReportName(attrs.reportname);
            } else
            {
                scope.popReportName(attrs.reportname);
            }
            elm.toggleClass('fa-check-square-o');
        });
    }
})

.directive('toggleViewClass', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            elm.toggleClass('fa-check-viewpage');
        });
    }
})

.directive('makeActive', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            elm.toggleClass('make-active');
        });
    }
})

.directive('showUnchecked', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
        });
    }
})

.directive('isNumber', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0)
                    return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
                    return;
                if (arr.length === 2 && newValue === '-.')
                    return;
                if (isNaN(newValue)) {
                    $parse(attrs.ngModel).assign(scope, oldValue);
                }
            });
        }
    };
})

.directive('numberMask', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).numeric();
        }
    }
})

.directive('calendar', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
})

.directive('gridDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.setGridDate(moment.utc(dateText, 'DD/MM/YYYY').format('D_M_YYYY'));
                    scope.selectDate = dateText;
                    scope.$apply(function() {
                        scope.selectDate = dateText;
                        localStorage.setItem('selectDate', dateText);
                        ngModel.$setViewValue(dateText);
                    });

                }
            });
        }
    };
})

.directive('fromDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                        $("#toDate").datepicker("option", "minDate", dateText)
                    });
                }
            });
        }
    };
})

.directive('toDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                minDate: attr.datadate,
                inline: true,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
})

.directive('toNewDate', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: attr.defaultdate,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.partData.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
})

.directive('joinDateChange', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.joinData.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.joinData.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
})

.directive('historyDate', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.historyData.date = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
})

.directive('divideDateChange1', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.divideData.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.divideData.delivery1 = dateText
                        scope.showdate_1 = true;
                    });
                }
            });
        }
    };
})

.directive('divideDateChange2', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.divideData.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.divideData.delivery2 = dateText
                        scope.showdate_2 = true;
                    });
                }
            });
        }
    };
})

.directive('componentDate', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.divideData.component.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.divideData.component.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
})

.directive('planningInicial', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                inline: true,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.planning.inicial = dateText
                        scope.inicialDate = true;
                    });
                }
            });
        }
    };
})

.directive('planningStartDateCreate', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.planningStartDate.startDate = dateText;
                        scope.startDate = true;
                    });
                }
            });
        }
    };
})

.directive('planningFinal', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                inline: true,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.planning.final = dateText
                        scope.finalDate = true;
                    });
                }
            });
        }
    };
})

.directive('getQuantity', function() {
    return function(scope, el, attrs) {
    }
})

.directive('datarowLoad', function() {
    return function(scope, el, attrs) {
    }
})

.directive('sortableFunc', ['$timeout', function(grid) {
    return function(scope, el, attrs) {
    }
}])

.directive('selectDelivery', function(services) {
    var tempMaterialId = '';
    var tempItemId = '';

    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.itemId.push(parseInt(attr.dataitem));
                scope.itemPartIdArr.push(parseInt(attr.datapart));
                scope.itemMaterialArr.push(parseInt(attr.datamaterial));
                scope.itemPartDeliveryArr.push(parseInt(attr.datadelivery));
            }
            else
            {
                scope.itemId.splice(scope.itemId.indexOf(parseInt(attr.dataitem)), 1);
                scope.itemPartIdArr.splice(scope.itemPartIdArr.indexOf(parseInt(attr.datapart)), 1);
                scope.itemMaterialArr.splice(scope.itemMaterialArr.indexOf(parseInt(attr.datamaterial)), 1);
                scope.itemPartDeliveryArr.splice(scope.itemPartDeliveryArr.indexOf(parseInt(attr.datadelivery)), 1);
            }
            console.log(JSON.stringify(scope.itemId));
            console.log(JSON.stringify(scope.itemPartIdArr));
            console.log(JSON.stringify(scope.itemMaterialArr));
            console.log(JSON.stringify(scope.itemPartDeliveryArr));
        });
    }
})

.directive('selectComponents', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.operationIdArr.push(parseInt(attr.operationid));
                scope.bomIdArr.push(parseInt(attr.bomid));
                scope.itemIdArr.push(parseInt(attr.itemid));
                scope.componentIdArr.push(parseInt(attr.componentid));
                scope.materialIdArr.push(parseInt(attr.materialid));
                scope.componentQunArr.push(parseFloat(attr.componentqun));
                scope.componentPesoArr.push(parseFloat(attr.componentpeso));
            }
            else
            {
                scope.operationIdArr.splice(scope.operationIdArr.indexOf(parseInt(attr.operationid)), 1);
                scope.bomIdArr.splice(scope.bomIdArr.indexOf(parseInt(attr.bomid)), 1);
                scope.itemIdArr.splice(scope.itemIdArr.indexOf(parseInt(attr.itemid)), 1);
                scope.componentIdArr.splice(scope.componentIdArr.indexOf(parseInt(attr.componentid)), 1);
                scope.materialIdArr.splice(scope.materialIdArr.indexOf(parseInt(attr.materialid)), 1);
                scope.componentQunArr.splice(scope.componentQunArr.indexOf(parseInt(attr.componentqun)), 1);
                scope.componentPesoArr.splice(scope.componentPesoArr.indexOf(parseInt(attr.componentpeso)), 1);
            }
//            console.log(JSON.stringify(scope.operationIdArr))
//            console.log(JSON.stringify(scope.bomIdArr))
//            console.log(JSON.stringify(scope.itemIdArr))
//            console.log(JSON.stringify(scope.componentIdArr))
//            console.log(JSON.stringify(scope.componentQunArr))
//            console.log(JSON.stringify(scope.componentPesoArr))
            calculateWeight();
        });
    }
})

.directive('selectProduce', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.produceArr.push(attr.operationid + ',' + attr.bomid + ',' + attr.itemid + ',' + attr.componentid + ',' + attr.produceid);
            }
            else
            {
                for (var i = 0; i < scope.produceArr.length; i++)
                {
                    var tempArr = scope.produceArr[i].split(',');
                    if (parseInt(tempArr[4]) == parseInt(attr.produceid))
                    {
                        scope.produceArr.splice(i, 1);
                    }
                }
            }
            console.log(JSON.stringify(scope.produceArr));
        });
    }
})

.directive('manageOperationcomponentsection', function(services) {
    return function(scope, elm, attr) {
        var operationid = attr.operationid;
        setTimeout(function() {
            $('.operationcompo_manage_button_' + operationid).click(function() {
                if ($('.operation_compo_section_' + operationid).html() == undefined)
                {
                    scope.loadOperationComponents(operationid);
                    $(this).addClass('fa-minus-square-o');
                } else if ($('.operation_compo_section_' + operationid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                {
                    $('.operation_compo_section_' + operationid).show('slow');
                    $(this).addClass('fa-minus-square-o');
                }
                else
                {
                    $('.operation_compo_section_' + operationid).hide('slow');
                    $(this).removeClass('fa-minus-square-o');
                }
            });
        }, 500);
    }
})

.directive('manageComponentchildsection', function(services) {
    return function(scope, elm, attr) {
        var operationid = attr.operationid;
        var bomid = attr.bomid;
        var itemid = attr.itemid;
        var componentid = attr.componentid;
        setTimeout(function() {
            $('.component_manage_button_' + componentid).click(function() {
                if ($('.component_section_' + componentid).html() == undefined)
                {
                    scope.loadComponentProduce(operationid, bomid, itemid, componentid);
                } else if ($('.component_section_' + componentid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                {
                    $('.component_section_' + componentid).show('slow');
                    $(this).addClass('fa-minus-square-o');
                }
                else
                {
                    $('.component_section_' + componentid).hide('slow');
                    $(this).removeClass('fa-minus-square-o');
                }
            });
        }, 500);
    }
})

.directive('manageOperationsection', function(services) {
    return function(scope, elm, attr) {
        var operationid = attr.operationid;
        setTimeout(function() {
            $('.operation_manage_button_' + operationid).click(function() {
                if ($('.operation_section_' + operationid).html() == undefined)
                {
                    scope.getOperationBomData(operationid);
                    $(this).addClass('fa-minus-square-o');
                } else if ($('.operation_section_' + operationid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                {
                    $('.operation_section_' + operationid).show('slow');
                    $(this).addClass('fa-minus-square-o');
                }
                else
                {
                    $('.operation_section_' + operationid).hide('slow');
                    $(this).removeClass('fa-minus-square-o');
                }
            });
        }, 500);
    }
})

.directive('manageBomsection', function(services) {
    return function(scope, elm, attr) {
        var operationid = attr.operationid;
        var bomid = attr.bomid;
        setTimeout(function() {
            $('.bom_manage_button_' + operationid + '_' + bomid).click(function() {
                if ($('.bom_section_' + operationid + '_' + bomid).html() == undefined)
                {
                    scope.getBomItemData(operationid, bomid);
                    $(this).addClass('fa-minus-square-o');
                } else if ($('.bom_section_' + operationid + '_' + bomid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                {
                    $('.bom_section_' + operationid + '_' + bomid).show('slow');
                    $(this).addClass('fa-minus-square-o');
                }
                else
                {
                    $('.bom_section_' + operationid + '_' + bomid).hide('slow');
                    $(this).removeClass('fa-minus-square-o');
                }
            });
        }, 500);
    }
})

.directive('manageItemsection', function(services) {
    return function(scope, elm, attr) {
        var operationid = attr.operationid;
        var bomid = attr.bomid;
        var itemid = attr.itemid;
        setTimeout(function() {
            $('.item_mange_button_' + operationid + '_' + bomid + '_' + itemid).click(function() {
                if ($('.item_section_' + operationid + '_' + bomid + '_' + itemid).html() == undefined)
                {
//                    scope.getItemComponentData(operationid, bomid, itemid);
                    $(this).addClass('fa-minus-square-o');
                } else if ($('.item_section_' + operationid + '_' + bomid + '_' + itemid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                {
                    $('.item_section_' + operationid + '_' + bomid + '_' + itemid).show('slow');
                    $(this).addClass('fa-minus-square-o');
                }
                else
                {
                    $('.item_section_' + operationid + '_' + bomid + '_' + itemid).hide('slow');
                    $(this).removeClass('fa-minus-square-o');
                }
            });
        }, 500);
    }
})

.directive('checkLogic', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.makeChecked(attr.dataitemid, attr.dataitemnumber);
            }
            else
            {
                scope.makeUnchecked(attr.dataitemid, attr.dataitemnumber);
            }
        });

    }
})

.directive('changeRemainingQuantity', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.remainingQtnArr.push(parseInt(attr.datadelivery));
            }
            else
            {
                scope.remainingQtnArr.splice(scope.remainingQtnArr.indexOf(parseInt(attr.datadelivery)), 1);
            }
            calculateShippingExecutionWeight();
        });
    }
})

.directive('exeChangeRemainingQuantity', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.remainingQtnArr.push(parseInt(attr.datadelivery));
            }
            else
            {
                scope.remainingQtnArr.splice(scope.remainingQtnArr.indexOf(parseInt(attr.datadelivery)), 1);
            }
            calculateManExecutionWeight();
        });
    }
})

.directive('leftSideMenu', function() {
    return function(scope, elm, attr) {
        elm.html('<div class="row">\n\
                    <div class="col" style="color: white;text-align: center">\n\
                        <a href="' + localStorage.getItem('MainRestangular') + '" style="text-decoration: none;color: #ffffff">\n\
                            <span class="logo-side-menu"></span>\n\
                            <span style="font-size: 30px; float:left; padding-top:16px; padding-left:10px; font-family: Open Sans">Altamira</span>\n\
                        </a>\n\
                    </div>\n\
                </div>\n\
                <div class="row vendas" style="background-color: #ef4e3a;margin: auto;width: 95%;margin-bottom: 10px;" onclick="leftMenuClick(\'vendas\');">\n\
                    <div class="col" style="text-align: center;color: #ffffff;">\n\
                        <div class="row">\n\
                            <div class="col">\n\
                                <span class="icon-side-tag"></span>\n\
                            </div>\n\
                        </div>\n\
                        <div class="row">\n\
                            <div class="col">\n\
                                <span style="font-size: 30px;">Vendas</span>\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div id="vendas" class="left-menu-items" style="display:auto;"><div class="row list-box" style="margin-bottom:10px;">\n\
                    <div class="col icon-list-box" style="background-color: #ef4e3a;">\n\
                        <a href="#/manufacture/bom" style="text-decoration: none;color: #000000">\n\
                            <div class="row">\n\
                                <div class="col" style="padding-top:15px;">\n\
                                    <span class="icon-side-list"></span>\n\
                                </div>\n\
                            </div>\n\
                            <div class="row produce-name" >\n\
                                <div class="col">\n\
                                    <span>Lista de Material</span>\n\
                                </div>\n\
                            </div>\n\
                        </a>\n\
                    </div>\n\
                    <div class="col icon-list-box" style="background-color: #ef4e3a;">\n\
                        <a href="#/manufacture/process/0" style="text-decoration: none;color: #000000">\n\
                            <div class="row">\n\
                                <div class="col" style="padding-top:15px;">\n\
                                    <span class="icon-side-github-6"></span>\n\
                                </div>\n\
                            </div>\n\
                            <div class="row produce-name" >\n\
                                <div class="col">\n\
                                    <span>Processo</span>\n\
                                </div>\n\
                            </div>\n\
                        </a>\n\
                    </div>\n\
                </div>\n\
                <div class="row list-box" style="margin-bottom:5px; padding-right:0px;">\n\
                    <div class="col icon-box2" style="background-color: #ef4e3a;">\n\
                        <a href="#/material/list" style="text-decoration:none" title="Cadastro de Material"><span class="fa-cubes"></span></a>\n\
                    </div>\n\
                    <div class="col  icon-box2" style="background-color: #ef4e3a;">\n\
                        <a href="#/shipping/planning" style="text-decoration:none" title="Planejamento de Entrega"><span class="fa-calendar"></span></a>\n\
                    </div>\n\
                    <div class="col  icon-box2" style="background-color: #ef4e3a;">\n\
                        <a href="#/shipping/execution" style="text-decoration:none" title="Expedicao"><span class="fa-truck"></span></a>\n\
                    </div>\n\
                    <div class="col  icon-box2" style="background-color: #ef4e3a;">\n\
                        <a href="#" style="text-decoration:none" title="Estatistics"><span class="fa-bar-chart"></span></a>\n\
                    </div>\n\
                </div>\n\
                <div class="row" style="background-color: #ef4e3a;margin: auto;width: 95%;margin-bottom: 10px; padding-top:4px; padding-bottom:4px;">\n\
                    <div class="col">\n\
                        <i style="margin-top:6px;" class="icon-side-file-pdf fg-white"></i>\n\
                                <span class="icon-title">Orçamento</span>\n\
                    </div>\n\
                </div>\n\
                <a href="#/manufacture/execution" style="text-decoration:none"><div class="row" style="background-color: #ef4e3a;margin: auto;width: 95%;margin-bottom: 10px; padding-top:8px; padding-bottom:8px;">\n\
                    <div class="col">\n\
                        <i class="icon-side-phone fg-white"></i>\n\
                        <span class="icon-title">Recados</span>\n\
                    </div>\n\
                </div></a></div>\n\
                ');
    }
})

function leftMenuClick(showMenu) {
    $(".left-menu-items").hide('slow');
    $("#" + showMenu).show('slow');
}

function totalWeightCal() {
    $('.totalWeightRow td').each(function(e) {
        var $th = $(this);
        $th.removeClass('totalWeightShow');
        $th.removeClass('green');
        var tempTotalWeight = 0;
        $('.' + $th.data('date')).each(function(f) {
            if ($(this).children().data('weight') != undefined && $(this).children().data('weight') != '')
            {
//                tempTotalWeight += Math.ceil(parseFloat($(this).children().data('weight')));
                tempTotalWeight += parseFloat($(this).children().data('weight'));
            }
        });
//        var precision = 3,
//                power = Math.pow(10, precision),
//                absValue = Math.abs(Math.round(tempTotalWeight * power)),
//                result = (tempTotalWeight < 0 ? '-' : '') + String(Math.floor(absValue / power));
//
//        if (precision > 0) {
//            var fraction = String(absValue % power),
//                    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
//            result += '.' + padding + fraction;
//        }
//        tempTotalWeight = result;
        if (tempTotalWeight != 0)
        {
            $th.addClass('totalWeightShow');
            $th.html(tempTotalWeight);
            if (tempTotalWeight > 30)
            {
                $th.addClass('red');
            } else
            {
                $th.addClass('green');
            }
        } else
        {
            $th.removeClass('totalWeightShow');
            $th.html('');
        }
    });
}
function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function totalRow() {
    return $('.dataTable tr').length;
}
function makeDummyRowLeft() {
    var totalrow = 23; // total 23
    var usedrow = $('#orderListLength').val();
    var dataTableRowLen = $('.dataTable tr').length;
    if (dataTableRowLen < totalrow)
    {
        for (usedrow; usedrow <= totalrow; usedrow++)
        {
            $('.dataTable tr:last').after('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
        }
    }

}
function makeDummyRowRight() {
    var totalrow = 23;
    var usedrow = $('#orderListLength').val();
    var mainTableRowLen = $('.mainTable tr').length;
    if (usedrow < mainTableRowLen)
    {
        var mainTableTR = '<tr style="height: 30px;">';
        $('.mainTable tr:nth-last-child(2) td').each(function() {
            var strClass = $(this).attr("class");
            var dataDay = $(this).data("day");
            if (strClass.indexOf('holiday') > -1) {
                mainTableTR += '<td class="' + dataDay + ' holiday">&nbsp;</td>';
            } else {
                mainTableTR += '<td class="' + dataDay + '">&nbsp;</td>';
            }
        });
        mainTableTR += '</tr>';
        for (usedrow; usedrow < totalrow; usedrow++)
        {
            $('.mainTable tr:last').before(mainTableTR);
        }
    }
    var allCells = $(".mainTable td");
    allCells.on("mouseover", function() {
        var el = $(this),
                pos = el.index();
        el.parent().find("th, td").addClass("hover");
        allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover");
    })
            .on("mouseout", function() {
        allCells.removeClass("hover");
    });

}
function calculateWeight()
{
    var totalWeight = 0;
    var factor = "1" + Array(+(3 > 0 && 3 + 1)).join("0");
    $('.delivery-table > tbody > tr > td:last-child').each(function() {
        if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
        {
            var remainW = parseFloat($('#remaining_' + $(this).children().attr('operationid') + '_' + $(this).children().attr('bomid') + '_' + $(this).children().attr('itemid') + '_' + $(this).children().attr('componentid')).val());
            var weight = (parseFloat($(this).children().attr('componentpeso')) / parseFloat($(this).children().attr('componentqun'))) * remainW;
            weight = Math.round(weight * factor) / factor;
            $('#weight_' + $(this).children().attr('operationid') + '_' + $(this).children().attr('bomid') + '_' + $(this).children().attr('itemid') + '_' + $(this).children().attr('componentid')).text(weight);
            totalWeight = totalWeight + weight;
        }
    });
    totalWeight = Math.round(totalWeight * factor) / factor;
    $('.total-weight').text(totalWeight);
}
function calculateManExecutionWeight()
{
    var totalWeight = 0;
    var factor = "1" + Array(+(3 > 0 && 3 + 1)).join("0");
    $('.delivery-table > tbody > tr > td:last-child').each(function() {
        if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
        {

            var remainW = parseFloat($('#remaining_' + $(this).children().attr('dataitem') + '_' + $(this).children().attr('datapart') + '_' + $(this).children().attr('datamaterial') + '_' + $(this).children().attr('datadelivery')).val());
            var weight = (parseFloat($(this).children().attr('componentpeso')) / parseFloat($(this).children().attr('componentqun'))) * remainW;
            weight = Math.round(weight * factor) / factor;
            $('#weight_' + $(this).children().attr('dataitem') + '_' + $(this).children().attr('datapart') + '_' + $(this).children().attr('datamaterial') + '_' + $(this).children().attr('datadelivery')).text(weight);
            totalWeight = totalWeight + weight;
        }
    });
    totalWeight = Math.round(totalWeight * factor) / factor;
    $('.total-weight').text(totalWeight);
}
function calculateShippingExecutionWeight()
{
    var totalWeight = 0;
    var factor = "1" + Array(+(3 > 0 && 3 + 1)).join("0");
    $('.delivery-table > tbody > tr > td:last-child').each(function() {
        if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
        {
            var remainW = parseFloat($('#remaining_' + $(this).children().attr('datadelivery')).val());
            var weight = (parseFloat($(this).children().attr('compoweight')) / parseFloat($(this).children().attr('compoquantity'))) * remainW;
            weight = Math.round(weight * factor) / factor;
            $('#weight_' + $(this).children().attr('datadelivery')).text(weight);
            totalWeight = totalWeight + weight;
        }
    });
}
function unique_arr(array) {
    return array.filter(function(el, index, arr) {
        return index == arr.indexOf(el);
    });
}