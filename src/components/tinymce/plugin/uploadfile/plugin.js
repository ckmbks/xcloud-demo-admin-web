/**
 * 文件上传插件 
 * 使用方式 配置images_upload_handler  
 * images_upload_handler(formData,next)
 * @param formData 表单数据 含一个字段file：为文件本身
 * @param next 上传成功后的回调 传入一个dom文本 该dom会直接拼接到富文本中
 * @author 李烨(Deat.Lee) deta_lee@outlook.com
 */
(function (window) {
    'use strict';
    var pluginName = '插入附件'
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    var openDialog = function (editor) {
      return function () {
        selectLocalFiles(editor)
      };
    };

    var selectLocalFiles = function(editor) { //选择文件方法 其他方法不要动
      var next = function(docText){ //插入dom文本 
        editor.insertContent(docText);
      }
      var input_f = document.createElement('input')
      input_f.type = "file"
      input_f.name = "thumbnail"
      input_f.addEventListener('change',function(e){
        var file = input_f.files[0]
        var formData = new window.FormData()
        formData.append('file', file)
        if(typeof editor.settings.upload_file_handler == 'function'){
          editor.settings.upload_file_handler(formData,next)
        }
      })
      input_f.click();
    }
    var register = function (editor) { //注册指令
      editor.addCommand('mceFile', function () {
        if (useQuickLink(editor)) {
          editor.fire('contexttoolbar-show', { toolbarKey: 'uploader' });
        } else {
          openDialog(editor)();
        }
      });
    };

    var setup = function (editor) { //注册快捷键
      editor.addShortcut('Meta+F', '', function () { 
        editor.execCommand('mceFile');
      });
    };

    var setupButtons = function (editor) { //注册更多菜单里的按钮
      editor.ui.registry.addToggleButton('uploader', {
        icon: 'new-document',
        tooltip: pluginName,
        onAction: openDialog(editor),
      });
    };
    var setupMenuItems = function (editor) { //注册插入菜单的按钮
      editor.ui.registry.addMenuItem('uploader', {
        icon: 'new-document',
        text: pluginName,
        // shortcut: 'Meta+F',
        onAction: openDialog(editor)
      });
    };
    function Plugin () {
      global.add('uploader', function (editor) {
        setupButtons(editor);
        setupMenuItems(editor);
        register(editor);
        setup(editor);
        return {
          getMetadata: function () {
            return  {
              name: pluginName,
            };
          }
        };
      });
    }

    Plugin();

}(window));
