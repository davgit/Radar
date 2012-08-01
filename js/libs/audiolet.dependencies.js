/*
---

name: Core

description: The heart of MooTools.

license: MIT-style license.

copyright: Copyright (c) 2006-2012 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

...
*/
(function(){this.MooTools={version:"1.4.6dev",build:"%build%"};var typeOf=this.typeOf=function(item){if(item==null)return"null";if(item.$family!=null)return item.$family();if(item.nodeName){if(item.nodeType==1)return"element";if(item.nodeType==3)return/\S/.test(item.nodeValue)?"textnode":"whitespace"}else if(typeof item.length=="number"){if(item.callee)return"arguments";if("item"in item)return"collection"}return typeof item};var instanceOf=this.instanceOf=function(item,object){if(item==null)return false;
var constructor=item.$constructor||item.constructor;while(constructor){if(constructor===object)return true;constructor=constructor.parent}if(!item.hasOwnProperty)return false;return item instanceof object};var Function=this.Function;var enumerables=true;for(var i in{toString:1})enumerables=null;if(enumerables)enumerables=["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];Function.prototype.overloadSetter=function(usePlural){var self=this;
return function(a,b){if(a==null)return this;if(usePlural||typeof a!="string"){for(var k in a)self.call(this,k,a[k]);if(enumerables)for(var i=enumerables.length;i--;){k=enumerables[i];if(a.hasOwnProperty(k))self.call(this,k,a[k])}}else self.call(this,a,b);return this}};Function.prototype.overloadGetter=function(usePlural){var self=this;return function(a){var args,result;if(typeof a!="string")args=a;else if(arguments.length>1)args=arguments;else if(usePlural)args=[a];if(args){result={};for(var i=0;i<
args.length;i++)result[args[i]]=self.call(this,args[i])}else result=self.call(this,a);return result}};Function.prototype.extend=function(key,value){this[key]=value}.overloadSetter();Function.prototype.implement=function(key,value){this.prototype[key]=value}.overloadSetter();var slice=Array.prototype.slice;Function.from=function(item){return typeOf(item)=="function"?item:function(){return item}};Array.from=function(item){if(item==null)return[];return Type.isEnumerable(item)&&typeof item!="string"?
typeOf(item)=="array"?item:slice.call(item):[item]};Number.from=function(item){var number=parseFloat(item);return isFinite(number)?number:null};String.from=function(item){return item+""};Function.implement({hide:function(){this.$hidden=true;return this},protect:function(){this.$protected=true;return this}});var Type=this.Type=function(name,object){if(name){var lower=name.toLowerCase();var typeCheck=function(item){return typeOf(item)==lower};Type["is"+name]=typeCheck;if(object!=null){object.prototype.$family=
function(){return lower}.hide();object.type=typeCheck}}if(object==null)return null;object.extend(this);object.$constructor=Type;object.prototype.$constructor=object;return object};var toString=Object.prototype.toString;Type.isEnumerable=function(item){return item!=null&&typeof item.length=="number"&&toString.call(item)!="[object Function]"};var hooks={};var hooksOf=function(object){var type=typeOf(object.prototype);return hooks[type]||(hooks[type]=[])};var implement=function(name,method){if(method&&
method.$hidden)return;var hooks=hooksOf(this);for(var i=0;i<hooks.length;i++){var hook=hooks[i];if(typeOf(hook)=="type")implement.call(hook,name,method);else hook.call(this,name,method)}var previous=this.prototype[name];if(previous==null||!previous.$protected)this.prototype[name]=method;if(this[name]==null&&typeOf(method)=="function")extend.call(this,name,function(item){return method.apply(item,slice.call(arguments,1))})};var extend=function(name,method){if(method&&method.$hidden)return;var previous=
this[name];if(previous==null||!previous.$protected)this[name]=method};Type.implement({implement:implement.overloadSetter(),extend:extend.overloadSetter(),alias:function(name,existing){implement.call(this,name,this.prototype[existing])}.overloadSetter(),mirror:function(hook){hooksOf(this).push(hook);return this}});new Type("Type",Type);var force=function(name,object,methods){var isType=object!=Object,prototype=object.prototype;if(isType)object=new Type(name,object);for(var i=0,l=methods.length;i<l;i++){var key=
methods[i],generic=object[key],proto=prototype[key];if(generic)generic.protect();if(isType&&proto)object.implement(key,proto.protect())}if(isType){var methodsEnumerable=prototype.propertyIsEnumerable(methods[0]);object.forEachMethod=function(fn){if(!methodsEnumerable)for(var i=0,l=methods.length;i<l;i++)fn.call(prototype,prototype[methods[i]],methods[i]);for(var key in prototype)fn.call(prototype,prototype[key],key)}}return force};force("String",String,["charAt","charCodeAt","concat","indexOf","lastIndexOf",
"match","quote","replace","search","slice","split","substr","substring","trim","toLowerCase","toUpperCase"])("Array",Array,["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight"])("Number",Number,["toExponential","toFixed","toLocaleString","toPrecision"])("Function",Function,["apply","call","bind"])("RegExp",RegExp,["exec","test"])("Object",Object,["create","defineProperty","defineProperties",
"keys","getPrototypeOf","getOwnPropertyDescriptor","getOwnPropertyNames","preventExtensions","isExtensible","seal","isSealed","freeze","isFrozen"])("Date",Date,["now"]);Object.extend=extend.overloadSetter();Date.extend("now",function(){return+new Date});new Type("Boolean",Boolean);Number.prototype.$family=function(){return isFinite(this)?"number":"null"}.hide();Number.extend("random",function(min,max){return Math.floor(Math.random()*(max-min+1)+min)});var hasOwnProperty=Object.prototype.hasOwnProperty;
Object.extend("forEach",function(object,fn,bind){for(var key in object)if(hasOwnProperty.call(object,key))fn.call(bind,object[key],key,object)});Object.each=Object.forEach;Array.implement({forEach:function(fn,bind){for(var i=0,l=this.length;i<l;i++)if(i in this)fn.call(bind,this[i],i,this)},each:function(fn,bind){Array.forEach(this,fn,bind);return this}});var cloneOf=function(item){switch(typeOf(item)){case "array":return item.clone();case "object":return Object.clone(item);default:return item}};
Array.implement("clone",function(){var i=this.length,clone=new Array(i);while(i--)clone[i]=cloneOf(this[i]);return clone});var mergeOne=function(source,key,current){switch(typeOf(current)){case "object":if(typeOf(source[key])=="object")Object.merge(source[key],current);else source[key]=Object.clone(current);break;case "array":source[key]=current.clone();break;default:source[key]=current}return source};Object.extend({merge:function(source,k,v){if(typeOf(k)=="string")return mergeOne(source,k,v);for(var i=
1,l=arguments.length;i<l;i++){var object=arguments[i];for(var key in object)mergeOne(source,key,object[key])}return source},clone:function(object){var clone={};for(var key in object)clone[key]=cloneOf(object[key]);return clone},append:function(original){for(var i=1,l=arguments.length;i<l;i++){var extended=arguments[i]||{};for(var key in extended)original[key]=extended[key]}return original}});["Object","WhiteSpace","TextNode","Collection","Arguments"].each(function(name){new Type(name)});var UID=Date.now();
String.extend("uniqueID",function(){return(UID++).toString(36)});var Hash=this.Hash=new Type("Hash",function(object){if(typeOf(object)=="hash")object=Object.clone(object.getClean());for(var key in object)this[key]=object[key];return this});Hash.implement({forEach:function(fn,bind){Object.forEach(this,fn,bind)},getClean:function(){var clean={};for(var key in this)if(this.hasOwnProperty(key))clean[key]=this[key];return clean},getLength:function(){var length=0;for(var key in this)if(this.hasOwnProperty(key))length++;
return length}});Hash.alias("each","forEach");Object.type=Type.isObject;var Native=this.Native=function(properties){return new Type(properties.name,properties.initialize)};Native.type=Type.type;Native.implement=function(objects,methods){for(var i=0;i<objects.length;i++)objects[i].implement(methods);return Native};var arrayType=Array.type;Array.type=function(item){return instanceOf(item,Array)||arrayType(item)};this.$A=function(item){return Array.from(item).slice()};this.$arguments=function(i){return function(){return arguments[i]}};
this.$chk=function(obj){return!!(obj||obj===0)};this.$clear=function(timer){clearTimeout(timer);clearInterval(timer);return null};this.$defined=function(obj){return obj!=null};this.$each=function(iterable,fn,bind){var type=typeOf(iterable);(type=="arguments"||type=="collection"||type=="array"||type=="elements"?Array:Object).each(iterable,fn,bind)};this.$empty=function(){};this.$extend=function(original,extended){return Object.append(original,extended)};this.$H=function(object){return new Hash(object)};
this.$merge=function(){var args=Array.slice(arguments);args.unshift({});return Object.merge.apply(null,args)};this.$lambda=Function.from;this.$mixin=Object.merge;this.$random=Number.random;this.$splat=Array.from;this.$time=Date.now;this.$type=function(object){var type=typeOf(object);if(type=="elements")return"array";return type=="null"?false:type};this.$unlink=function(object){switch(typeOf(object)){case "object":return Object.clone(object);case "array":return Array.clone(object);case "hash":return new Hash(object);
default:return object}}})();
(function(){var Class=this.Class=new Type("Class",function(params){if(instanceOf(params,Function))params={initialize:params};var newClass=function(){reset(this);if(newClass.$prototyping)return this;this.$caller=null;var value=this.initialize?this.initialize.apply(this,arguments):this;this.$caller=this.caller=null;return value}.extend(this).implement(params);newClass.$constructor=Class;newClass.prototype.$constructor=newClass;newClass.prototype.parent=parent;return newClass});var parent=function(){if(!this.$caller)throw new Error('The method "parent" cannot be called.');
var name=this.$caller.$name,parent=this.$caller.$owner.parent,previous=parent?parent.prototype[name]:null;if(!previous)throw new Error('The method "'+name+'" has no parent.');return previous.apply(this,arguments)};var reset=function(object){for(var key in object){var value=object[key];switch(typeOf(value)){case "object":var F=function(){};F.prototype=value;object[key]=reset(new F);break;case "array":object[key]=value.clone();break}}return object};var wrap=function(self,key,method){if(method.$origin)method=
method.$origin;var wrapper=function(){if(method.$protected&&this.$caller==null)throw new Error('The method "'+key+'" cannot be called.');var caller=this.caller,current=this.$caller;this.caller=current;this.$caller=wrapper;var result=method.apply(this,arguments);this.$caller=current;this.caller=caller;return result}.extend({$owner:self,$origin:method,$name:key});return wrapper};var implement=function(key,value,retain){if(Class.Mutators.hasOwnProperty(key)){value=Class.Mutators[key].call(this,value);
if(value==null)return this}if(typeOf(value)=="function"){if(value.$hidden)return this;this.prototype[key]=retain?value:wrap(this,key,value)}else Object.merge(this.prototype,key,value);return this};var getInstance=function(klass){klass.$prototyping=true;var proto=new klass;delete klass.$prototyping;return proto};Class.implement("implement",implement.overloadSetter());Class.Mutators={Extends:function(parent){this.parent=parent;this.prototype=getInstance(parent)},Implements:function(items){Array.from(items).each(function(item){var instance=
new item;for(var key in instance)implement.call(this,key,instance[key],true)},this)}}})();