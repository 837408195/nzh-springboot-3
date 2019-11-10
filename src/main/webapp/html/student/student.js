function select() {
    $('#table-list').bootstrapTable({
        url: '/student/list',
        columns: [{
            field: 'sno',
            title: '学号'
        }, {
            field: 'sname',
            title: '姓名'
        }, {
            field: 'major',
            title: '专业'
        }, {
            field: 'grade',
            title: '班级'
        }, {
            field: 'phone',
            title: '手机号'
        }, {
            field: 'skill',
            title: '特长'
        }, {
            field: 'id',
            title: '操作',
            formatter:option
        }]
    })
}

function option(value, row, index) {
    var htm = '<button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" onclick="openModal(\'edit\','+value+')">编辑</button>' +
        '<a href="/student/delete?id='+value+'" class="btn btn-primary btn-sm" style="margin-left: 25px">删除</a>'
    return htm;
}
function openModal(flag, id) {
    if (flag == 'edit') {
        $.get('/student/selectOne?id=' + id, function (data) {
            $("input[name='sno']").val(data.sno);
            $("input[name='sname']").val(data.sname);
            $("input[name='major']").val(data.major);
            $("input[name='grade']").val(data.grade);
            $("input[name='phone']").val(data.phone);
            $("input[name='skill']").val(data.skill);
        })
    } else {
        $("input[name='sno']").val("");
        $("input[name='sname']").val("");
        $("input[name='major']").val("");
        $("input[name='grade']").val("");
        $("input[name='phone']").val("");
        $("input[name='skill']").val("");
    }
}

function saveOrUpdate() {
    debugger
    var params = {};
    params.sno = $("input[name='sno']").val();
    params.sname = $("input[name='sname']").val();
    params.major = $("input[name='major']").val();
    params.grade = $("input[name='grade']").val();
    params.phone = $("input[name='phone']").val();
    params.skill = $("input[name='skill']").val();
    $.post("/student/insert", params, function () {
        window.location.reload()
    })
}
select()
