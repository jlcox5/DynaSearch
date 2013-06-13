/*
/*
---
description: table sorter
 
license: MIT-style
 
authors:
- cnizzdotcom
 
requires:
core:1.2.4: '*'
 
provides: [table sorting]
...
*/
 */
var TableSorter = new Class({
	Implements: [Options],
	options:{
		head: '',
		request: '', 
		action: '', 
		destination: '', 
		prev: '', 
		next: '', 
		rows: 50, 
		page: location.href, 
		method: 'get',
		defaultStartEndWaitEnabled: 1,
		startWait: '',
		endWait: ''
	},
	initialize: function(options){
		this.setOptions(options);
		this.orderBy = '';
		this.column = '';
		this.param = '';
		this.paramArr = new Array();
		var tr = $(this.options.head).getParent();
		var tbl = tr.getParent();
		this.table = tbl;
		this.setDomElements();
		this.direction = 'upArrow';
		this.cellIndex = null;
		this.headRowIndex = null;
		this.tblLen = null;
	},
	sort: function(column,param,start,tblLen,headRowIndex,cellIndex){ // send resort request	
		if(this.options.defaultStartEndWaitEnabled==1){
			this.reloadView(1);
		}
		else{
			eval(this.options.startWait)
		}
		
		this.cellIndex = cellIndex;
		this.headRowIndex = headRowIndex;
		this.tblLen = tblLen;
		var destination = this.options.destination;
		
		if(column==undefined){
			column='';
		}
		if(param==undefined){
			param='';
		}
		this.column = column;
		this.param = param;
		
		if(isNaN(start)){
			start=0;
		}
		
		var paramStr='';
		for(var i=0;i<this.paramArr.length;i++){
			paramStr+= '&'+this.paramArr[i].name+'='+this.paramArr[i].value;
		}
		
		var xhr = new Request({
			url: this.options.page,
			method: this.options.method,
			onComplete: function(){
				if(this.options.defaultStartEndWaitEnabled==1){
					this.reloadView(0);
				}
				else{
					eval(this.options.startWait)
				}
				
				$(destination).innerHTML = xhr.response.text;
				this.setDomElements();
				var tr = $(this.options.head).getParent();
				var tbl = tr.getParent();
				this.table = tbl;
				var header = false;
				
				for(var i=headRowIndex;i<(tblLen-headRowIndex);i++){
					var cell = this.table.rows[i].cells;

					if(i%2)
					{
						cell[cellIndex].addClass('focusedColumn');
						cell[cellIndex].addClass('focusedColumn');
					}
					else{
						if(header===false){
							var text = cell[this.cellIndex].innerHTML;
							cell[cellIndex].innerHTML='<div class="'+this.direction+'">&nbsp;</div><div class="TableSorterFloatLeft">'+text+'</div>';
							header=true;
						}
						else{
							cell[cellIndex].addClass('focusedColumn');
							cell[cellIndex].addClass('focusedColumn');
						}
					}
				}
			}.bind(this)
		}).send(this.options.request+'='+this.options.action+'&column='+column+'&start='+start+'&rows='+this.options.rows+'&param='+param+'&orderBy='+this.orderBy+paramStr);
	},
	setDomElements: function(column,param){ // set dom events
		if(this.options.prev!='')
		{
			$(this.options.prev).addEvent('click',function(){
				this.sort(this.column,this.param,($(this.options.prev).title*1)-this.options.rows,this.tblLen,this.headRowIndex,this.cellIndex);
			}.bind(this));
		}
		if(this.options.next!='')
		{
			$(this.options.next).addEvent('click',function(){
				this.sort(this.column,this.param,($(this.options.next).title*1),this.tblLen,this.headRowIndex,this.cellIndex);
			}.bind(this))
		}
		
		var childrenArr = $(this.options.head).getChildren();
		var len = childrenArr.length;
		var o = this;
		var tblLen = this.table.getElementsByTagName('tr').length;
		var headRowIndex = $(o.options.head).rowIndex;
		
		for(var i=0;i<len;i++){
 			if(childrenArr[i].id!=''){
				$(childrenArr[i]).addEvent('click',function(){
					o.orderBy=this.title;
					o.sort(o.column,o.param,0,tblLen,headRowIndex,this.cellIndex);
					if(o.direction=='upArrow'){
						o.direction = 'downArrow';
					}
					else{
						o.direction = 'upArrow';
					}
				})
			}
		}
		this.direction = o.direction;
	},
	reloadView: function(is_viewable){
		if(is_viewable==1){ // displays ajax loader
			$(this.options.destination).innerHTML = '<div style="margin:0 auto;font-size:200%;width:250px;">&nbsp;</div>';
			$(this.options.destination).addClass('TableSorterLoadImage');
			$(this.options.destination).fade('out');
		}
		else{ // removes ajax loader
			$(this.options.destination).fade('in');
			$(this.options.destination).removeClass('TableSorterLoadImage');
		}
	},
	addParameter: function(name,value){ // add additional xhr request string (name/parameter)
		var Parameter = new Class({
			initialize: function(name,value){
				this.name = name;
				this.value = value;
			},
		})
		param = new Parameter(name,value);
		this.paramArr.push(param);
	},
	removeParameter: function(name){ // remove xhr request string
		var len = this.paramArr.length;
		var tmpArr = new Array();
		for(var i=0;i<len;i++){
			if(this.paramArr[i].name!=name){
				tmpArr.push(this.paramArr[i]);
			}
		}
		this.paramArr = tmpArr;
	},
	removeAllParameters: function(){
		this.paramArr = new Array();
	}
})
