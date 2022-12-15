import Mock from 'mockjs';

Mock.mock('/xvuetifyapi/dict/getDropdownList',
  "post",
  (options: any) => {
    return {
      "code": "200",
      "message": "成功",
      "data":
        [
          {
            "id": 2730, "value": "0", "label": "教授"
          },
          {
            "id": 2731, "value": "470574077958946817 ", "label": "副教授"
          },
          {
            "id": 2732, "value": "470574077958946818", "label": "讲师"
          },
          {
            "id": 2733, "value": "470574077958946820", "label": "助教"
          }
        ]
    }
  }
);

Mock.mock(RegExp('/xvuetifyapi/teacher/search.*'),
  "post",
  (options: any) => {
    return {
      "code": "200",
      "message": "成功",
      "data":
      {
        "content":
          [
            { "id": 274, "nondegreeeduTeacherCode": "C2020057", "name": "222", "userNo": "2222", "source": "校内", "academicTitle": "教授", "salary": 0E-10, "mobilePhone": "", "status": "启用" }, 
            { "id": 273, "nondegreeeduTeacherCode": "C2020056", "name": "兲", "userNo": "905", "source": "校内", "academicTitle": "", "salary": 0E-10, "mobilePhone": "", "status": "启用" }, 
            { "id": 272, "nondegreeeduTeacherCode": "C2020055", "name": "吴雯雯", "userNo": "309201212201", "source": "校内", "academicTitle": "教授", "salary": 0E-10, "mobilePhone": "13666025652", "status": "禁用" }, 
            { "id": 271, "nondegreeeduTeacherCode": "C2020054", "name": "林林琳", "userNo": "ST1111", "source": "校内", "academicTitle": "", "salary": 0E-10, "mobilePhone": "17300000000", "status": "启用" }, 
            { "id": 270, "nondegreeeduTeacherCode": "C2020053", "name": "VG是的2222", "userNo": "800522", "source": "校内", "academicTitle": "", "salary": 23.6545400000, "mobilePhone": null, "status": "启用" }, 
            { "id": 269, "nondegreeeduTeacherCode": "C2020052", "name": "无语子", "userNo": "jiaoshi88", "source": "校内", "academicTitle": "教授", "salary": 26.5600000000, "mobilePhone": null, "status": "启用" }, 
            { "id": 268, "nondegreeeduTeacherCode": "C2020051", "name": "教师1", "userNo": "jiaoshi87", "source": "校内", "academicTitle": "", "salary": 0E-10, "mobilePhone": "", "status": "启用" }, 
            { "id": 267, "nondegreeeduTeacherCode": "C2020050", "name": "吴春明", "userNo": "202011050949", "source": "校内", "academicTitle": "教授", "salary": 1000.0000000000, "mobilePhone": "", "status": "禁用" }, 
            { "id": 266, "nondegreeeduTeacherCode": "C2020049", "name": "李菲", "userNo": "Jia1908200201", "source": "校内", "academicTitle": "副教授", "salary": 300.0000000000, "mobilePhone": "18505083392", "status": "启用" }, 
            { "id": 265, "nondegreeeduTeacherCode": "C2020048", "name": "朱峰", "userNo": "jiaoshi86", "source": "校外", "academicTitle": "教授", "salary": 75000.0000000000, "mobilePhone": "", "status": "启用" },
            { "id": 286, "nondegreeeduTeacherCode": "C2020048", "name": "朱峰", "userNo": "jiaoshi86", "source": "校外", "academicTitle": "教授", "salary": 75000.0000000000, "mobilePhone": "", "status": "启用" },
            { "id": 287, "nondegreeeduTeacherCode": "C2020048", "name": "朱峰", "userNo": "jiaoshi86", "source": "校外", "academicTitle": "教授", "salary": 75000.0000000000, "mobilePhone": "", "status": "启用" },
            { "id": 288, "nondegreeeduTeacherCode": "C2020048", "name": "朱峰", "userNo": "jiaoshi86", "source": "校外", "academicTitle": "教授", "salary": 75000.0000000000, "mobilePhone": "", "status": "启用" },
            { "id": 289, "nondegreeeduTeacherCode": "C2020048", "name": "朱峰", "userNo": "jiaoshi86", "source": "校外", "academicTitle": "教授", "salary": 75000.0000000000, "mobilePhone": "", "status": "启用" },
            { "id": 290, "nondegreeeduTeacherCode": "C2020048", "name": "朱峰", "userNo": "jiaoshi86", "source": "校外", "academicTitle": "教授", "salary": 75000.0000000000, "mobilePhone": "", "status": "启用" },
          ],
        "pageIndex": 1,
        "pageSize": 10,
        "totalElements": 98,
        "totalPages": 10
      }
    }
  }
);

Mock.mock(RegExp('/xvuetifyapi/teacher/getById.*'),
  "post",
  {
    "code": "200",
    "message": "成功",
    "data": [
      { "userNo": "110", "name": "初始管理员", "userId": "110" },
      { "userNo": "30920122202446", "name": "张炫", "userId": "353550674522275850" },
      { "userNo": "12022", "name": "吴亦凡", "userId": "439842609439965184" },
      { "userNo": "2021011008", "name": "王玮玮", "userId": "534424436422475776" }
    ]
  }
);

Mock.mock('/xvuetifyapi/dict/getDropdownList1',
  "post",
  {
    "code": "200",
    "message": "成功",
    "data":
      [
        {
          "id": 2730, "value": "0", "label": "教授"
        },
        {
          "id": 2731, "value": "470574077958946817 ", "label": "副教授"
        },
        {
          "id": 2732, "value": "470574077958946818", "label": "讲师"
        },
        {
          "id": 2733, "value": "470574077958946820", "label": "助教"
        }
      ]
  }
);