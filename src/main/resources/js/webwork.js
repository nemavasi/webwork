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

    // инициализация селектов при открытии страницы
    var arrObjs = AJS.$("table.tableparams tr td input.user_select");
    var arrLen = arrObjs.length;

    for (var i = 0; i < arrLen; i++) {
        // AJS.$('.user_select').select2({
        AJS.$(arrObjs[i]).select2({
            // minimumInputLength: 0,
            ajax: {
                delay: 250,
                url: function(searchdata) {
                    return AJS.params.baseURL + "/rest/api/2/user/search?username=" + searchdata;
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
                        jsonObj.id = data[i].name;
                        //jsonObj.id = i;
                        jsonObj.text = data[i].displayName;
                        retVal.push(jsonObj);
                    }

                    // Tranforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: retVal
                    };
                }
            }
        });

        var jsonText = AJS.$(arrObjs[i]).parent().find("span.userinfo");
        if (jsonText.length == 1) {
            var jsonObj = JSON.parse(jsonText.text());
            AJS.$(arrObjs[i]).select2('data', { id:jsonObj.username, text: jsonObj.userdisplayname});
        }

    }

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






});


// прицепить событие добавить строку
function bindClickOnAddRowButton(procType, nomTable) {

    AJS.$("#" + procType + "_action_add_" + nomTable).click(function() {
        // содержимое строки
        var tableRow = '<tr><td>'
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
                    return AJS.params.baseURL + "/rest/api/2/user/search?username=" + searchdata;
                },
                dataType: 'json',
                results: function (data, page) {
                    var retVal = [];
                    for (var i = 0; i < data.length; i++) {
                        var jsonObj = {};
                        jsonObj.id = data[i].name;
                        jsonObj.text = data[i].displayName;
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
    //console.log(strJSON);


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
                body: '<p>Не сохранено</p>',
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
        AJS.$("#" + ztype + "_table_" + n_str + " tr td input.user_select").each(function(index, value) {
            var objSelect = AJS.$(value).select2("data");
            if (objSelect != null) {
                oneParam.users.push(objSelect.id);
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

