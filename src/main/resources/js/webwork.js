AJS.$(function() {

    //////////////////////////////////////////////////////
    // создание структуры документа
    //////////////////////////////////////////////////////
    //createDocumentStructure();

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
    AJS.$("#action_add_1").click(function() {
        // содержимое строки
        var tableRow = "<tr><td>"
            + '<input class="text medium-field" type="text" name="useraccount" placeholder="логин пользователя" value=""/>'
            + "</td><td>"
            + '<input name="btndelrow" class="button submit" type="button" value="Удалить"/>'
            + '</td></tr>';

        // добавляем строку
        var table = AJS.$("#table_1");
        table.append(tableRow);

        // тут устанавливаем событие на кнопку удаления в строке

        // все кнопки
        var objInputs = AJS.$("#table_1 tr td input");
        // последняя наша
        var lastInput = objInputs[objInputs.length - 1];
        // устанавливаем событие
        AJS.$(lastInput).click(function() {
            this.parentElement.parentElement.remove();
        })

    });


});

// передать данные на сервер через
function submitData() {

    // для формирования json
    var arrJSON = [];

    arrJSON.push(getParamsFromTab("vofm"));
    arrJSON.push(getParamsFromTab("izofm"));

    // проверка готового объекта json
    //console.log(arrJSON);
    var strJSON = JSON.stringify(arrJSON);
    // console.log(strJSON);


    AJS.$.ajax({
        type:   "post",
        dataType: "json",
        // contentType: "application/json; charset=utf-8",
        url:    "secure/ConfigWebwork!save.jspa",
        // data:   strJSON,
        data:   {"configJson": strJSON},
        success: function(e) {
            AJS.messages.info({
                title: '-',
                fadeout: true,
                body: '<p> Сохранил.</p>',
            });
        },
        error: function(d) {
            AJS.messages.info({
                title: '-.',
                fadeout: true,
                body: '<p> Не сохранил.</p>',
            });
        },
    })

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

        AJS.$("#" + ztype + "_table_" + n_str + " tr td input[name=useraccount]").each(function(index, value) {

            oneParam.users.push(AJS.$(value).val());
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

// создание структуры таблиц документа
// 1 - чтение настроек
// 2 - чтение идентификаторов полей из настроек
// 3 - чтение всех возможных значений полей из настроек
// 4 - создание таблиц для полей и заполнение их настройками
function createDocumentStructure() {
    // 1 - чтение настроек
    getParamsFromServer();
}

function getParamsFromServer() {
    AJS.$.ajax({
        async:  false,
        type:   "get",
        dataType: "json",
        url:    "secure/ConfigWebwork!read.jspa",
        success: function(dataFromServ, textStatus) {
            console.log(textStatus);
            console.log(dataFromServ);
        },
        error: function(d) {
            console.log("ошибка получения данных с сервера");
        },
    })

}
