AJS.$(function() {

    //////////////////////////////////////////////////////
    // инициализация селектов
    //////////////////////////////////////////////////////
    // нужно перебрать все в цикле
    //$("#mySelect2").select2('data', { id:"elementID", text: "Hello!"});


    //////////////////////////////////////////////////////
    // предотвращения нажатия Enter в полях ввода
    //////////////////////////////////////////////////////
    AJS.$("form").keydown( function(event){
        if(event.keyCode == 13) {
            //console.log("=============== enter");
            event.preventDefault();
            return false;
        }
    });

    $('.user_select').select2({
        ajax: {
            delay: 250,
            url: function(searchdata) {
                return "/jira/rest/api/2/user/search?username=" + searchdata;
            },

            // url: 'https://api.github.com/search/repositories',
            dataType: 'json',
            // data: function (term, page) {
            //     // зачем то надо еще не понял зачем
            //     return {q: term};
            // },
            results: function (data, page) {
                var retVal = [];
                for (var i = 0; i < data.length; i++) {
                    var jsonObj = {};
                    jsonObj.id = data[i].displayName;
                    //jsonObj.id = i;
                    jsonObj.text = data[i].name;
                    retVal.push(jsonObj);
                }

                // Tranforms the top-level key of the response object from 'items' to 'results'
                return {
                    results: retVal
                };
            }
        }
    });

    //////////////////////////////////////////////////////
    // инициализируем селекты
    //////////////////////////////////////////////////////
    // var objs = AJS.$("#bosses_tab tbody tr")
    // var cnt = objs.length;
    //
    // for (var i = 0; i < cnt; i++) {
    //     selectBossesInitLastRow(i);
    // }
    //
    // // событие на кнопку добавить строку в руководители подразделений
    // bindClickOnAddRowButtonBosses();


    //
    //
    // AJS.$("#group1").auiSelect2();
    // AJS.$("#boss1").auiSelect2({
    //     ajax: {
    //         delay: 250,
    //         url: function() {
    //
    //             // возьмем значение группы
    //             var grpCondition = "";
    //             if (AJS.$("#group1").select2("data").id != "empty") {
    //                 grpCondition = "?groupname=" + AJS.$("#group1").select2("data").text;
    //             }
    //
    //             return "/jira/rest/usersfromgroup/1.0/usersfromgroup" + grpCondition;
    //         },
    //         //dataType: "json",
    //         //processResults: function (data) {
    //         //results: function (data, page)
    //         results: function (data) {
    //
    //             retVal = [];
    //
    //             for (var i = 0; i < data.length; i++) {
    //                 jsonObj = {};
    //                 jsonObj.id = data[i].value;
    //                 //jsonObj.id = i;
    //                 jsonObj.text = data[i].label;
    //                 retVal.push(jsonObj);
    //             }
    //
    //             // Tranforms the top-level key of the response object from 'items' to 'results'
    //             return {
    //                 results: retVal
    //             };
    //         }
    //     }
    // });
    //
    // // при смене группы убираем все значения в руководителе
    // AJS.$("#group1").on("change", function (e) {
    //     //AJS.$('#boss1').val(null).trigger('change');
    //     AJS.$("#boss1").select2("data", null)
    // });
    //

    // AJS.$("input[type=button][name=delrow]").each(function() {
    //     AJS.$(this).click(function() {
    //         AJS.$(this).parentElement.parentElement.remove();
    //     })
    // })


    //////////////////////////////////////////////////////
    // кнопка удаления строки таблицы
    //////////////////////////////////////////////////////
    var objs = AJS.$("input[type=button][name=btndelrow]");
    var cnt = objs.length;

    if (cnt > 0) {
        for (var i = 0; i < cnt; i++) {
            //console.log(i);
            //var btn = AJS.$("input[type=button][name=btndelrow]")[i];
            //var btn = objs[i];
            AJS.$(objs[i]).click(function() {
                AJS.$(this)[0].parentElement.parentElement.remove();
            })
        }
    }


    //////////////////////////////////////////////////////
    // кнопка отправки данных на сервер
    //////////////////////////////////////////////////////
    // var objs = AJS.$("input[type=button][name=btnsubm]");
    var objs = AJS.$("button[name=btnsubm]");
    var cnt = objs.length;

    if (cnt > 0) {
        for (var i = 0; i < cnt; i++) {
            AJS.$(objs[i]).click(function(){
                submitData();
            });
        }
    }


    //////////////////////////////////////////////////////
    // кнопка добавления строки к таблице
    //////////////////////////////////////////////////////
    // получим все эти кнопки в цикле
    //////////////////////////////////////////////////////
    // по первой вкладке
    var procType = "vofm";
    var n_int = 1;
    //var n_str = n_int.toString();
    var checkSet = AJS.$("#vofm_tab table").length;

    for (n_int = 1; n_int <= checkSet; n_int++) {
        bindClickOnAddRowButton(procType, n_int.toString())
    }

    //////////////////////////////////////////////////////
    // по второй вкладке
    var procType = "izofm";
    var n_int = 1;
    //var n_str = n_int.toString();
    var checkSet = AJS.$("#izofm_tab table").length;

    for (n_int = 1; n_int <= checkSet; n_int++) {
        bindClickOnAddRowButton(procType, n_int.toString())
    }


    //////////////////////////////////////////////////////
    // получаем все группы
    //////////////////////////////////////////////////////

    // AJS.$.ajax({
    //     url: "/jira/rest/api/2/groups/picker",
    //
    //     type: 'get',
    //     dataType: 'json',
    //     async: false,
    //     success: function(data) {
    //
    //         var stroka = "";
    //         for (var i = 0; i < data.total; i++) {
    //             //console.log(data.groups[i].name);
    //             stroka = stroka + "<aui-option>" + data.groups[i].name + "</aui-option>"
    //         }
    //
    //         console.log(stroka);
    //
    //         AJS.$("aui-select[name=usergroup]").each(function (index, value) {
    //             AJS.$(value).append(stroka);
    //         });
    //     }
    // });





});



// прицепить событие добавить строку
// в таблицу руководителей подразделений
// function bindClickOnAddRowButtonBosses() {
//
//     AJS.$("#bosses_action_add").click(function(){
//         // узнаем текущее количество строк
//         var objs = AJS.$("#bosses_tab tbody tr");
//         var cnt = objs.length;
//         cnt++;
//         var cnt_str = cnt.toString();
//
//
//         console.log(cnt);
//         console.log(cnt_str);
//
//         // тут будут хранится опции для выбора группы
//         var grOpts = '<option selected value="empty">Выберите группу</option>';
//
//         // тут получим группы
//         var jsonGroupsTxt = AJS.$.ajax({
//             url: AJS.params.baseURL + "/rest/api/2/groups/picker",
//             dataType: "json",
//             success: function (result) {
//                 // разбираеме json, сразу формируем опции
//                 // var len = result.length;
//                 // for (var i = 0; i < len; i++) {
//                 //     grOpts = grOpts + '<option value="' + result[i].name + '">' + result[i].name + '</option>';
//                 // }
//             },
//             async: false
//         }).responseText;
//
//
//         var jsonGroupsObj = JSON.parse(jsonGroupsTxt);
//
//         for (var i = 0; i < jsonGroupsObj.total; i++) {
//             grOpts = grOpts + '<option value="' + jsonGroupsObj.groups[i].name + '">' + jsonGroupsObj.groups[i].name + '</option>';
//         }
//
//
//         //console.log(grOpts);
//         var tableRow = "<tr><td>"
//             +'<select class="select2-group" style="width: 300px;">'
//             +grOpts
//             +'</select>'
//             +'</td><td>'
//             +'<input type="hidden" class="select2-boss" style="width: 200px;"></input>'
//             +'</td><td>'
//             +'<input name="btndelrow" class="button submit" type="button" value="Удалить"/>'
//             +'</td></tr>';
//
//
//         AJS.$("#bosses_tab table tbody").append(tableRow);
//
//
//
//
//         // тут устанавливаем событие на кнопку удаления в строке
//
//         // все кнопки
//         var objInputs = AJS.$("#bosses_tab table tr td input");
//         // последняя наша
//         var lastInput = objInputs[objInputs.length - 1];
//         // устанавливаем событие
//         AJS.$(lastInput).click(function() {
//             this.parentElement.parentElement.remove();
//         })
//
//
//
//         selectBossesInitLastRow();
//
//
//     })
//
//
// }




// прицепить событие добавить строку
function bindClickOnAddRowButton(procType, nomTable) {

    AJS.$("#" + procType + "_action_add_" + nomTable).click(function() {
        // содержимое строки
        // var tableRow = "<tr><td>"
        //     + '<input class="text medium-field" type="text" name="useraccount" placeholder="логин пользователя" value=""/>'
        //     + "</td><td>"
        //     + '<input name="btndelrow" class="button submit" type="button" value="Удалить"/>'
        //     + '</td></tr>';


        var tableRow = '<tr><td>'
            + '<input class="text medium-field" type="hidden" name="useraccount" placeholder="логин пользователя" value=""/>'
            + '</td><td>'
            + '<input type="hidden" class="user_select" style="width: 200px;"></input>'
            + '</td><td>'
            + '<input name="btndelrow" class="button submit" type="button" value="Удалить"/>'
            + '</td></tr>';



        // добавляем строку
        var table = AJS.$("#" + procType + "_table_" + nomTable);
        table.append(tableRow);

        // инициализируем селект

        // тут устанавливаем событие на кнопку удаления в строке
        // берем все из таблицы, последний добавленный наш
        var objSelect = AJS.$("#" + procType + "_table_" + nomTable + " tr td .user_select");
        var lastSelect = objSelect[objSelect.length - 1];
        AJS.$(lastSelect).select2({
            ajax: {
                delay: 250,
                url: function(searchdata) {
                    return "/jira/rest/api/2/user/search?username=" + searchdata;
                },
                dataType: 'json',
                results: function (data, page) {
                    var retVal = [];
                    for (var i = 0; i < data.length; i++) {
                        var jsonObj = {};
                        jsonObj.id = data[i].displayName;
                        jsonObj.text = data[i].name;
                        retVal.push(jsonObj);
                    }

                    return {
                        results: retVal
                    };
                }
            }
        });

        // все кнопки
        var objInputs = AJS.$("#" + procType + "_table_" + nomTable + " tr td input");
        // последняя наша
        var lastInput = objInputs[objInputs.length - 1];
        // устанавливаем событие
        AJS.$(lastInput).click(function() {
            this.parentElement.parentElement.remove();
        })

    });

}


// передать данные на сервер через
function submitData() {

    // для формирования json
    var arrJSON = [];

    arrJSON.push(getParamsFromTab("vofm"));
    arrJSON.push(getParamsFromTab("izofm"));



    // проверка готового объекта json
    //console.log(arrJSON);
    var strJSON = JSON.stringify(arrJSON);
    console.log(strJSON);


    AJS.$.ajax({
        type:   "post",
        dataType: "json",
        // contentType: "application/json; charset=utf-8",
        url:    "secure/ConfigWebwork!save.jspa",
        // data:   strJSON,
        data:   {"configJson": strJSON},
        success: function(e) {
            AJS.messages.info({
                title: '',
                fadeout: true,
                body: '<p>Сохранено</p>',
            });
        },
        error: function(xhr, ajaxOptions, thrownError) {
            AJS.messages.info({
                title: '',
                fadeout: true,
                body: '<p>Не сохраено</p>',
            });
        },
    });

}

// данные с одной вкладки
function getParamsFromTab(ztype) {

    var oneTab = {};
    oneTab.ztype = ztype;
    oneTab.id = AJS.$("#" + ztype).val();
    oneTab.params = [];


    // переменные для обхода таблиц в цикле
    var n_int = 1;
    var n_str = n_int.toString();
    var checkSet = AJS.$("#" + ztype + "_title_" + n_str).length;


    // собираем пользователей по таблице
    while (checkSet != 0) {

        var oneParam = {};
        oneParam.name = AJS.$("#" + ztype + "_title_" + n_str + " span").text();
        oneParam.users = [];

        // AJS.$("#" + ztype + "_table_" + n_str + " tr td input[name=useraccount]").each(function(index, value) {
        AJS.$("#" + ztype + "_table_" + n_str + " tr td .user_select").each(function(index, value) {
            if (AJS.$(value).select2("data") != null) {
                oneParam.users.push(AJS.$(value).select2("data").text);
            }
        });

        oneTab.params.push(oneParam);

        // увеличиваем счетчик
        n_int++;
        n_str = n_int.toString();
        checkSet = AJS.$("#" + ztype + "_title_" + n_str).length;
    }

    // проверка готового объекта json
    //console.log(arrJSON);
    // var strJSON = JSON.stringify(oneTab);
    // console.log(strJSON);
    return oneTab;
}


// данные с одной вкладки
// function getParamsFromBossesTab() {
//     var oneTab = {};
//     oneTab.ztype = "bosses";
//     oneTab.id = "bosses";
//     oneTab.params = [];
//
//
//     var thisRowGroupSelect = null;
//     var thisRowBossSelect = null;
//
//     var rows = AJS.$("#bosses_tab table tbody tr");
//     var rowsLen = AJS.$("#bosses_tab table tbody tr").size();
//
//     for (var i = 0; i < rowsLen; i++) {
//         thisRowGroupSelect = AJS.$(rows[i]).find(".select2-group");
//         thisRowBossSelect = AJS.$(rows[i]).find(".select2-boss");
//
//         dataGroup = thisRowGroupSelect.select2("data");
//         dataBoss = thisRowBossSelect.select2("data");
//
//         // пропустим пустые
//         if ((dataGroup.id == "empty") || (dataBoss == null)) {
//             continue;
//         }
//
//         var oneParam = {};
//         oneParam.group = dataGroup.text;
//         oneParam.bossName = dataBoss.text;
//         oneParam.bossLogin = dataBoss.id;
//
//         oneTab.params.push(oneParam);
//
//     }
//
//     return oneTab;
// }

// тестовая функция
// function test_param(xxx) {
//     console.log(xxx);
//     if (xxx == null) {
//         console.log("ok");
//     }
// }



// инициализация селектов в сформировавшемся DOM
// function selectBossesInitLastRow(nomer_stroki) {
//
//     // количество строк таблицы
//     var cnt = AJS.$(".select2-group").length;
//
//     // текущая строка последняя как правило, но если передан nomer_stroki то берем строку с этим номером как текущую
//     if (nomer_stroki == null) {
//         if (cnt > 0) {
//             cnt--;
//         } else {
//             return;
//         }
//     } else {
//         cnt = nomer_stroki;
//     }
//
//     //AJS.$("#group" + initNum).auiSelect2();
//
//     var selectGroup = AJS.$(AJS.$(".select2-group")[cnt]);
//     var selectBoss = AJS.$(AJS.$(".select2-boss")[cnt]);
//
//     //AJS.$(AJS.$(".select2-group")[cnt]).auiSelect2();
//     selectGroup.auiSelect2();
//
//
//     //AJS.$(AJS.$(".select2-boss")[cnt]).auiSelect2({
//     selectBoss.auiSelect2({
//         ajax: {
//             delay: 250,
//             url: function() {
//
//                 // console.log(1);
//                 // console.log(this);
//                 // console.log(2);
//                 // console.log(this.parent());
//                 // console.log(3);
//                 // console.log(this.parent().parent());
//                 // console.log(4);
//                 // console.log(   this.parent().parent().find(".select2-group"));
//                 //
//                 // console.log(5);
//                 // var grSelect = this.parent().parent().find(".select2-group");
//                 // console.log(grSelect.select2("data"));
//                 //
//                 //
//                 // console.log(this.parent().parent().children());
//                 // console.log(this.parent().parent().children()[0]);
//                 //
//                 // console.log("=====================");
//                 //
//                 // console.log(this.select2("data"));
//                 // console.log(AJS.$(this).select2("data"));
//
//                 var thisRowGroupSelect = this.parent().parent().find(".select2-group");
//
//                 // возьмем значение группы
//                 var grpCondition = "";
//                 if (thisRowGroupSelect.select2("data").id != "empty") {
//                     grpCondition = "?groupname=" + thisRowGroupSelect.select2("data").text;
//                 }
//
//                 return "/jira/rest/usersfromgroup/1.0/usersfromgroup" + grpCondition;
//             },
//             //dataType: "json",
//             //processResults: function (data) {
//             //results: function (data, page)
//             results: function (data) {
//
//                 retVal = [];
//
//                 for (var i = 0; i < data.length; i++) {
//                     jsonObj = {};
//                     jsonObj.id = data[i].value;
//                     //jsonObj.id = i;
//                     jsonObj.text = data[i].label;
//                     retVal.push(jsonObj);
//                 }
//
//                 // Tranforms the top-level key of the response object from 'items' to 'results'
//                 return {
//                     results: retVal
//                 };
//             }
//         }
//     });
//
//     // при смене группы убираем все значения в руководителе
//     selectGroup.on("change", function (e) {
//         selectBoss.select2("data", null)
//     });
//
//
// }