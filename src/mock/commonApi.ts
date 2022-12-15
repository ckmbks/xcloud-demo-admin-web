import Mock from 'mockjs';

Mock.mock('/xclouddemoadminapi/homePage/getUser',
  "post",
  {
    "code": 200,
    "message": "成功",
    "data":
    {
      "name": "张炫",
      "position": "管理员",
      "department": "管理部",
      "userNo": "30920122202446",
      "sex": "女",
      "phone": "15957487433"
    }
  }
);

Mock.mock('/xclouddemoadminapi/account/getCurrentAccount',
  "post",
  {
    "code": "200",
    "message": "成功",
    "data":
    {
      "schoolId": "default",
      "cas": true,
      "time": 1608686990220,
      "userId": "353550674522275850",
      "id": null,
      "userNo": "30920122202446",
      "name": "张炫",
      "type": "TEACHER",
      "ticket": "ticket_cas_1608686990190",
      "account": null,
      "college": null,
      "sex": null,
      "inSchool": null,
      "grade": null,
      "studentType": null,
      "educationLevel": null,
      "admin": true
    }
  }
);

Mock.mock('/xclouddemoadminapi/menus/getMenuList?sys=xvuetify',
  "post",
  {
    "code": "200",
    "message": "成功",
    "data":
      [
        {
          "id": 327,
          "code": null,
          "name": "系统管理",
          "url": null,
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus":
            [
              {
                "id": 328,
                "code": null,
                "name": "角色管理",
                "url": "/Role",
                "level": 2,
                "rank": null,
                "sort": 10,
                "tooltip": null,
                "subMenus": []
              },
              {
                "id": 329, "code": null, "name": "税率管理", "url": "/TaxRate", "level": 2, "rank": null, "sort": 20, "tooltip": null, "subMenus": []
              },
              {
                "id": 330, "code": null, "name": "字典管理", "url": "/Dictionary", "level": 2, "rank": null, "sort": 30, "tooltip": null, "subMenus": []
              },
              {
                "id": 331, "code": null, "name": "模板管理", "url": "/Template", "level": 2, "rank": null, "sort": 40, "tooltip": null, "subMenus": []
              },
              {
                "id": 332, "code": null, "name": "登录日志", "url": "/LoginLog", "level": 2, "rank": null, "sort": 50, "tooltip": null, "subMenus": []
              },
              {
                "id": 333, "code": null, "name": "操作日志", "url": "/OperationLog", "level": 2, "rank": null, "sort": 60, "tooltip": null, "subMenus": []
              }
            ]
        },
        {
          "id": 321,
          "code": null,
          "name": "后勤资源管理",
          "url": null,
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus":
            [
              {
                "id": 322, "code": null, "name": "后勤资源管理", "url": "/LogisticsResources", "level": 2, "rank": null, "sort": 10, "tooltip": null, "subMenus": []
              },
              {
                "id": 323, "code": null, "name": "文件管理", "url": "/FileManager", "level": 2, "rank": null, "sort": 20, "tooltip": null, "subMenus": []
              }
            ]
        },
        {
          "id": 324,
          "code": null,
          "name": "培训缴费管理",
          "url": null,
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus":
            [
              {
                "id": 325, "code": null, "name": "培训缴费管理", "url": "/TrainingPayment", "level": 2, "rank": null, "sort": 10, "tooltip": null, "subMenus": []
              },
              {
                "id": 326, "code": null, "name": "支付订单管理", "url": "/PaymentOrder", "level": 2, "rank": null, "sort": 20, "tooltip": null, "subMenus": []
              }
            ]
        },
        {
          "id": 301,
          "code": null,
          "name": "基础数据管理",
          "url": null,
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus":
            [
              {
                "id": 302,
                "code": null, "name": "教师管理", "url": "/Teacher", "level": 2, "rank": null, "sort": 10, "tooltip": null, "subMenus": []
              },
              {
                "id": 303, "code": null, "name": "班主任管理", "url": "/Headmaster", "level": 2, "rank": null, "sort": 20, "tooltip": null, "subMenus": []
              },
              {
                "id": 304, "code": null, "name": "教职工管理", "url": "/Staff", "level": 2, "rank": null, "sort": 30, "tooltip": null, "subMenus": []
              },
              {
                "id": 305, "code": null, "name": "学生助理管理", "url": "/Assistant", "level": 2, "rank": null, "sort": 40, "tooltip": null, "subMenus": []
              },
              {
                "id": 306, "code": null, "name": "教室管理", "url": "/Classroom", "level": 2, "rank": null, "sort": 50, "tooltip": null, "subMenus": []
              },
              {
                "id": 307, "code": null, "name": "课程资源管理", "url": "/CurriculumResources", "level": 2, "rank": null, "sort": 60, "tooltip": null, "subMenus": []
              },
              {
                "id": 308, "code": null, "name": "业务小组管理", "url": "/OperationalTeam", "level": 2, "rank": null, "sort": 70, "tooltip": null, "subMenus": []
              }
            ]
        },
        {
          "id": 316,
          "code": null,
          "name": "财务管理",
          "url": null,
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus":
            [
              {
                "id": 317,
                "code": null, "name": "薪酬管理", "url": "/SalaryManager", "level": 2, "rank": null, "sort": 10, "tooltip": null, "subMenus": []
              },
              {
                "id": 318, "code": null, "name": "结算明细列表", "url": "/SettlementView", "level": 2, "rank": null, "sort": 20, "tooltip": null, "subMenus": []
              },
              {
                "id": 320, "code": null, "name": "项目实施费用管理", "url": "/ProjectCost", "level": 2, "rank": null, "sort": 40, "tooltip": null, "subMenus": []
              }
            ]
        },
        {
          "id": 300,
          "code": "",
          "name": "首页",
          "url": "/Home",
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus": []
        },
        {
          "id": 309,
          "code": null,
          "name": "项目管理",
          "url": null,
          "level": 1,
          "rank": null,
          "sort": 1,
          "tooltip": null,
          "subMenus":
            [
              {
                "id": 310,
                "code": null, "name": "项目分配", "url": "/ProjectAllocation", "level": 2, "rank": null, "sort": 10, "tooltip": null, "subMenus": []
              },
              {
                "id": 311, "code": null, "name": "培训方案管理", "url": "/TrainingProgram", "level": 2, "rank": null, "sort": 20, "tooltip": null, "subMenus": []
              },
              {
                "id": 312, "code": null, "name": "培训协议管理", "url": "/TrainingAgreement", "level": 2, "rank": null, "sort": 30, "tooltip": null, "subMenus": []
              },
              {
                "id": 313, "code": null, "name": "培训指南管理", "url": "/TrainingGuide", "level": 2, "rank": null, "sort": 40, "tooltip": null, "subMenus": []
              },
              {
                "id": 314, "code": null, "name": "培训实施管理", "url": "/TrainingImplementation", "level": 2, "rank": null, "sort": 50, "tooltip": null, "subMenus": []
              },
              {
                "id": 315, "code": null, "name": "培训信息查看", "url": "/TrainingInfo", "level": 2, "rank": null, "sort": 60, "tooltip": null, "subMenus": []
              }
            ]
        }
      ]
  }
);
