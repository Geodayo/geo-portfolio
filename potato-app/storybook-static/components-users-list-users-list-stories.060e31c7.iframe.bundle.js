"use strict";(self.webpackChunkpotato_app=self.webpackChunkpotato_app||[]).push([[71],{"./src/components/users-list/users-list.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{var _UsersListPreview_parameters,_UsersListPreview_parameters_docs,_UsersListPreview_parameters1;__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UsersListPreview:()=>UsersListPreview,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Users List",component:__webpack_require__("./src/components/users-list/users-list.component.tsx").H,tags:["autodocs"],parameters:{layout:"fullscreen"}},UsersListPreview={args:{users:[{thumbnail:"./totoro-profile.jpg",name:"Anonymous"}]}};UsersListPreview.parameters={...UsersListPreview.parameters,docs:{...null===(_UsersListPreview_parameters=UsersListPreview.parameters)||void 0===_UsersListPreview_parameters?void 0:_UsersListPreview_parameters.docs,source:{originalSource:'{\n  args: {\n    users: [{\n      thumbnail: "./totoro-profile.jpg",\n      name: "Anonymous"\n    }]\n  }\n}',...null===(_UsersListPreview_parameters1=UsersListPreview.parameters)||void 0===_UsersListPreview_parameters1||null===(_UsersListPreview_parameters_docs=_UsersListPreview_parameters1.docs)||void 0===_UsersListPreview_parameters_docs?void 0:_UsersListPreview_parameters_docs.source}}};const __namedExportsOrder=["UsersListPreview"]},"./src/components/users-list/users-list.component.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{H:()=>UsersList});var jsx_runtime=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),injectStylesIntoStyleTag=(__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),users_list_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[14].use[1]!./node_modules/postcss-loader/dist/cjs.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[14].use[4]!./src/components/users-list/users-list.module.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(users_list_module.A,options);const users_list_users_list_module=users_list_module.A&&users_list_module.A.locals?users_list_module.A.locals:void 0,UsersList=param=>{let{listName="Online - 1",users}=param;return(0,jsx_runtime.jsxs)("div",{className:users_list_users_list_module.container,children:[(0,jsx_runtime.jsx)("div",{className:users_list_users_list_module.listName,children:listName}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)("ul",{className:users_list_users_list_module.list,children:[(0,jsx_runtime.jsxs)("li",{children:[(0,jsx_runtime.jsx)("div",{className:users_list_users_list_module.thumbnail,style:{backgroundImage:"url(./totoro-profile.jpg)"}}),(0,jsx_runtime.jsx)("span",{children:"Geo"}),(0,jsx_runtime.jsx)("svg",{"aria-label":"Server Owner",className:users_list_users_list_module.crown,"aria-hidden":"false",role:"img",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"none",viewBox:"0 0 24 24",children:(0,jsx_runtime.jsx)("path",{fill:"currentColor",d:"M5 18a1 1 0 0 0-1 1 3 3 0 0 0 3 3h10a3 3 0 0 0 3-3 1 1 0 0 0-1-1H5ZM3.04 7.76a1 1 0 0 0-1.52 1.15l2.25 6.42a1 1 0 0 0 .94.67h14.55a1 1 0 0 0 .95-.71l1.94-6.45a1 1 0 0 0-1.55-1.1l-4.11 3-3.55-5.33.82-.82a.83.83 0 0 0 0-1.18l-1.17-1.17a.83.83 0 0 0-1.18 0l-1.17 1.17a.83.83 0 0 0 0 1.18l.82.82-3.61 5.42-4.41-3.07Z"})})]}),users&&users.map(((user,index)=>(0,jsx_runtime.jsxs)("li",{children:[(0,jsx_runtime.jsx)("div",{className:users_list_users_list_module.thumbnail,style:{backgroundImage:"url(".concat(user.thumbnail,")")}}),(0,jsx_runtime.jsx)("span",{children:user.name})]},"user-".concat(index))))]})})]})};UsersList.__docgenInfo={description:"",methods:[],displayName:"UsersList",props:{listName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Online - 1"',computed:!1}},users:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{\r\n  thumbnail: string;\r\n  name: string;\r\n}",signature:{properties:[{key:"thumbnail",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:"{\r\n  thumbnail: string;\r\n  name: string;\r\n}[]"},description:""}}}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[14].use[1]!./node_modules/postcss-loader/dist/cjs.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[14].use[4]!./src/components/users-list/users-list.module.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,'.users-list_container__mKndp{width:100%}.users-list_listName__bTxjw{display:flex;align-items:center;gap:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;line-height:16px;letter-spacing:.02em;font-weight:600;text-transform:uppercase;cursor:pointer;color:color-mix(in oklab, hsl(214, 8.1%, 61.2%) 100%, black 0%)}.users-list_list___QZVV{list-style-type:none;margin:0;padding:0}.users-list_list___QZVV li{display:flex;position:relative;padding:2px;align-items:center;cursor:pointer;gap:8px;margin-top:12px;color:color-mix(in oklab, hsl(214, 8.1%, 61.2%) 100%, black 0%)}.users-list_list___QZVV li svg{margin-left:-2px;width:14px;height:14px;color:color-mix(in oklab, hsl(40, 86.4%, 56.9%) 100%, black 0%)}.users-list_list___QZVV li:hover::after{content:"";display:block;position:absolute;top:0;left:0;width:100%;height:100%;background-color:#fff;opacity:.1}.users-list_thumbnail__XfvYz{display:block;position:relative;width:32px;height:32px;background-size:cover;background-repeat:no-repeat;background-position:center center;border-radius:50%;cursor:pointer;transition:border-radius .1s ease-out,color .1s ease-out}.users-list_thumbnail__XfvYz::after{content:"";box-sizing:border-box;position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;border:1px solid #2b2d31;background-color:#3ea557}',"",{version:3,sources:["webpack://./src/components/users-list/users-list.module.scss"],names:[],mappings:"AAAA,6BACE,UAAA,CAGF,4BACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CACA,cAAA,CACA,gBAAA,CACA,oBAAA,CACA,eAAA,CACA,wBAAA,CACA,cAAA,CACA,+DAAA,CAGF,wBACE,oBAAA,CACA,QAAA,CACA,SAAA,CAEA,2BACE,YAAA,CACA,iBAAA,CACA,WAAA,CACA,kBAAA,CACA,cAAA,CACA,OAAA,CACA,eAAA,CACA,+DAAA,CAMA,+BACE,gBAAA,CACA,UAAA,CACA,WAAA,CACA,+DAAA,CAQJ,wCACE,UAAA,CACA,aAAA,CACA,iBAAA,CACA,KAAA,CACA,MAAA,CACA,UAAA,CACA,WAAA,CACA,qBAAA,CACA,UAAA,CAIJ,6BACE,aAAA,CACA,iBAAA,CACA,UAAA,CACA,WAAA,CACA,qBAAA,CACA,2BAAA,CACA,iCAAA,CACA,iBAAA,CACA,cAAA,CACA,wDAAA,CAGF,oCACE,UAAA,CACA,qBAAA,CACA,iBAAA,CACA,QAAA,CACA,OAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,wBAAA,CACA,wBAAA",sourcesContent:[".container {\r\n  width: 100%;\r\n}\r\n\r\n.listName {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 2px;\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  font-size: 12px;\r\n  line-height: 16px;\r\n  letter-spacing: 0.02em;\r\n  font-weight: 600;\r\n  text-transform: uppercase;\r\n  cursor: pointer;\r\n  color: color-mix(in oklab, hsl(214 calc(1 * 8.1%) 61.2% / 1) 100%, black 0%);\r\n}\r\n\r\n.list {\r\n  list-style-type: none;\r\n  margin: 0;\r\n  padding: 0;\r\n\r\n  li {\r\n    display: flex;\r\n    position: relative;\r\n    padding: 2px;\r\n    align-items: center;\r\n    cursor: pointer;\r\n    gap: 8px;\r\n    margin-top: 12px;\r\n    color: color-mix(\r\n      in oklab,\r\n      hsl(214 calc(1 * 8.1%) 61.2% / 1) 100%,\r\n      black 0%\r\n    );\r\n\r\n    svg {\r\n      margin-left: -2px;\r\n      width: 14px;\r\n      height: 14px;\r\n      color: color-mix(\r\n        in oklab,\r\n        hsl(40 calc(1 * 86.4%) 56.9% / 1) 100%,\r\n        black 0%\r\n      );\r\n    }\r\n  }\r\n\r\n  li:hover::after {\r\n    content: '';\r\n    display: block;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: white;\r\n    opacity: 0.1;\r\n  }\r\n}\r\n\r\n.thumbnail {\r\n  display: block;\r\n  position: relative;\r\n  width: 32px;\r\n  height: 32px;\r\n  background-size: cover;\r\n  background-repeat: no-repeat;\r\n  background-position: center center;\r\n  border-radius: 50%;\r\n  cursor: pointer;\r\n  transition: border-radius 0.1s ease-out, color 0.1s ease-out;\r\n}\r\n\r\n.thumbnail::after {\r\n  content: \"\";\r\n  box-sizing: border-box;\r\n  position: absolute;\r\n  bottom: 0;\r\n  right: 0;\r\n  width: 10px;\r\n  height: 10px;\r\n  border-radius: 50%;\r\n  border: 1px solid #2b2d31;\r\n  background-color: #3ea557;\r\n}\r\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"users-list_container__mKndp",listName:"users-list_listName__bTxjw",list:"users-list_list___QZVV",thumbnail:"users-list_thumbnail__XfvYz"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/runtime/api.js":module=>{module.exports=function(cssWithMappingToString){var list=[];return list.toString=function toString(){return this.map((function(item){var content="",needLayer=void 0!==item[5];return item[4]&&(content+="@supports (".concat(item[4],") {")),item[2]&&(content+="@media ".concat(item[2]," {")),needLayer&&(content+="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {")),content+=cssWithMappingToString(item),needLayer&&(content+="}"),item[2]&&(content+="}"),item[4]&&(content+="}"),content})).join("")},list.i=function i(modules,media,dedupe,supports,layer){"string"==typeof modules&&(modules=[[null,modules,void 0]]);var alreadyImportedModules={};if(dedupe)for(var k=0;k<this.length;k++){var id=this[k][0];null!=id&&(alreadyImportedModules[id]=!0)}for(var _k=0;_k<modules.length;_k++){var item=[].concat(modules[_k]);dedupe&&alreadyImportedModules[item[0]]||(void 0!==layer&&(void 0===item[5]||(item[1]="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {").concat(item[1],"}")),item[5]=layer),media&&(item[2]?(item[1]="@media ".concat(item[2]," {").concat(item[1],"}"),item[2]=media):item[2]=media),supports&&(item[4]?(item[1]="@supports (".concat(item[4],") {").concat(item[1],"}"),item[4]=supports):item[4]="".concat(supports)),list.push(item))}},list}},"./node_modules/css-loader/dist/runtime/sourceMaps.js":module=>{module.exports=function(item){var content=item[1],cssMapping=item[3];if(!cssMapping)return content;if("function"==typeof btoa){var base64=btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping)))),data="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64),sourceMapping="/*# ".concat(data," */");return[content].concat([sourceMapping]).join("\n")}return[content].join("\n")}},"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":module=>{var stylesInDOM=[];function getIndexByIdentifier(identifier){for(var result=-1,i=0;i<stylesInDOM.length;i++)if(stylesInDOM[i].identifier===identifier){result=i;break}return result}function modulesToDom(list,options){for(var idCountMap={},identifiers=[],i=0;i<list.length;i++){var item=list[i],id=options.base?item[0]+options.base:item[0],count=idCountMap[id]||0,identifier="".concat(id," ").concat(count);idCountMap[id]=count+1;var indexByIdentifier=getIndexByIdentifier(identifier),obj={css:item[1],media:item[2],sourceMap:item[3],supports:item[4],layer:item[5]};if(-1!==indexByIdentifier)stylesInDOM[indexByIdentifier].references++,stylesInDOM[indexByIdentifier].updater(obj);else{var updater=addElementStyle(obj,options);options.byIndex=i,stylesInDOM.splice(i,0,{identifier,updater,references:1})}identifiers.push(identifier)}return identifiers}function addElementStyle(obj,options){var api=options.domAPI(options);api.update(obj);return function updater(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap&&newObj.supports===obj.supports&&newObj.layer===obj.layer)return;api.update(obj=newObj)}else api.remove()}}module.exports=function(list,options){var lastIdentifiers=modulesToDom(list=list||[],options=options||{});return function update(newList){newList=newList||[];for(var i=0;i<lastIdentifiers.length;i++){var index=getIndexByIdentifier(lastIdentifiers[i]);stylesInDOM[index].references--}for(var newLastIdentifiers=modulesToDom(newList,options),_i=0;_i<lastIdentifiers.length;_i++){var _index=getIndexByIdentifier(lastIdentifiers[_i]);0===stylesInDOM[_index].references&&(stylesInDOM[_index].updater(),stylesInDOM.splice(_index,1))}lastIdentifiers=newLastIdentifiers}}},"./node_modules/style-loader/dist/runtime/insertBySelector.js":module=>{var memo={};module.exports=function insertBySelector(insert,style){var target=function getTarget(target){if(void 0===memo[target]){var styleTarget=document.querySelector(target);if(window.HTMLIFrameElement&&styleTarget instanceof window.HTMLIFrameElement)try{styleTarget=styleTarget.contentDocument.head}catch(e){styleTarget=null}memo[target]=styleTarget}return memo[target]}(insert);if(!target)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");target.appendChild(style)}},"./node_modules/style-loader/dist/runtime/insertStyleElement.js":module=>{module.exports=function insertStyleElement(options){var element=document.createElement("style");return options.setAttributes(element,options.attributes),options.insert(element,options.options),element}},"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=function setAttributesWithoutAttributes(styleElement){var nonce=__webpack_require__.nc;nonce&&styleElement.setAttribute("nonce",nonce)}},"./node_modules/style-loader/dist/runtime/styleDomAPI.js":module=>{module.exports=function domAPI(options){if("undefined"==typeof document)return{update:function update(){},remove:function remove(){}};var styleElement=options.insertStyleElement(options);return{update:function update(obj){!function apply(styleElement,options,obj){var css="";obj.supports&&(css+="@supports (".concat(obj.supports,") {")),obj.media&&(css+="@media ".concat(obj.media," {"));var needLayer=void 0!==obj.layer;needLayer&&(css+="@layer".concat(obj.layer.length>0?" ".concat(obj.layer):""," {")),css+=obj.css,needLayer&&(css+="}"),obj.media&&(css+="}"),obj.supports&&(css+="}");var sourceMap=obj.sourceMap;sourceMap&&"undefined"!=typeof btoa&&(css+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))," */")),options.styleTagTransform(css,styleElement,options.options)}(styleElement,options,obj)},remove:function remove(){!function removeStyleElement(styleElement){if(null===styleElement.parentNode)return!1;styleElement.parentNode.removeChild(styleElement)}(styleElement)}}}},"./node_modules/style-loader/dist/runtime/styleTagTransform.js":module=>{module.exports=function styleTagTransform(css,styleElement){if(styleElement.styleSheet)styleElement.styleSheet.cssText=css;else{for(;styleElement.firstChild;)styleElement.removeChild(styleElement.firstChild);styleElement.appendChild(document.createTextNode(css))}}}}]);