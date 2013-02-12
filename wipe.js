Effect.Wipe = function(element) {
	element = $(element);
	
	element.setStyle({'overflow':'hidden'});
	element.makePositioned();
	
	var options = {
				newImg		: '',
				duration 	: 1,
				mode 		: 'vSplit',
				delay 		: 0.0,
				panels		: 10
				};
	Object.extend(options,arguments[1]);
	var oldImg = element.down('img').readAttribute('src')
	var tempImg = new Image()
	tempImg.src = oldImg
	var wipeWidth=tempImg.width
	var wipeHeight=tempImg.height
	var wipeCenter = parseInt(wipeWidth/2)
	var wipeMiddle = parseInt(wipeHeight/2)

	var startstyle = {
		display:'none',
		overflow:'hidden',
		position:'absolute',
		zIndex:10
	}
	var divleft = new Element('div',{id:'wipeLeft'})
	var divright = new Element('div',{id:'wipeRight'})
	divleft.setStyle(startstyle)
	divright.setStyle(startstyle)

	switch(options.mode) {
	
	case 'vSplit':
		divleft.setStyle({
			left:'0px',
			top:'0px',
			width:wipeCenter+'px',
			height:wipeHeight+'px',
			backgroundImage:'url('+oldImg+')'
		})
		divright.setStyle({
			left:wipeCenter+'px',
			top:'0px',
			width:wipeCenter+'px',
			height:wipeHeight+'px',
			backgroundPosition:'-'+wipeCenter+'px 0px',
			backgroundImage:'url('+oldImg+')'
		})
		element.insert(divleft)	
		element.insert(divright)	
		return new Effect.Parallel([
			new Effect.Morph('wipeLeft',{sync:true,duration:options.duration,style:'width:0px'}), 
			new Effect.Morph('wipeRight',{sync:true,duration:options.duration,style:'left:'+wipeWidth+'px;width:0px;background-position:-'+wipeWidth+'px 0px'})], { 
				beforeStart: function() {
					$('wipeLeft').show()
					$('wipeRight').show()
					element.down('img').writeAttribute('src',options.newImg)
				},
				afterFinish: function() {
					$('wipeLeft').remove()
					$('wipeRight').remove()
				},
				duration:options.duration
			}
		)
	  break;    
	case 'hSplit':
		divleft.setStyle({
			left:'0px',
			top:'0px',
			width:wipeWidth+'px',
			height:wipeMiddle+'px',
			backgroundImage:'url('+oldImg+')'
		})
		divright.setStyle({
			left:'0px',
			top:wipeMiddle+'px',
			width:wipeWidth+'px',
			height:wipeMiddle+'px',
			backgroundPosition:'0px -'+wipeMiddle+'px',
			backgroundImage:'url('+oldImg+')'
		})
		element.insert(divleft)
		element.insert(divright)
		return new Effect.Parallel([
			new Effect.Morph('wipeLeft',{sync:true,duration:options.duration,style:'height:0px'}), 
			new Effect.Morph('wipeRight',{sync:true,duration:options.duration,style:'top:'+wipeHeight+'px;height:0px;'})], { 
				afterUpdate: function() {
					//work-around to fix fact that effect.morph does not handle background position properly
					$('wipeRight').style.backgroundPosition='0px -'+$('wipeRight').style.top
				},
				beforeStart: function() {					
					$('wipeLeft').show()
					$('wipeRight').show()
					element.down('img').writeAttribute('src',options.newImg)
				},
				afterFinish: function() {
					$('wipeLeft').remove()
					$('wipeRight').remove()
				},
				duration:options.duration
			}
		)
	break;
	case 'toRight':
		divright.setStyle({
			top:'0px',
			left:'0px',
			width:'0px',
			height:wipeHeight+'px',
			backgroundPosition:'0px 0px',
			backgroundImage:'url('+options.newImg+')'
		})
		element.insert(divright)
		return new Effect.Morph('wipeRight',{
			duration:options.duration,
			style:'width:'+wipeWidth+'px', 
			beforeStart: function() {
				$('wipeRight').show()
			},
			afterFinish: function() {				
				element.down('img').writeAttribute('src',options.newImg)
				$('wipeRight').remove()
			}}
		)
	break;
	case 'toLeft':
		divright.setStyle({
			top:'0px',
			left:wipeWidth+'px',
			width:'0px',
			height:wipeHeight+'px',
			backgroundPosition:'-'+wipeWidth+'px 0px',
			backgroundImage:'url('+options.newImg+')'
		})
		element.insert(divright)
		return new Effect.Morph('wipeRight',{
			duration:options.duration,
			style:'left:0px;width:'+wipeWidth+'px;background-position:0px 0px', 
			beforeStart: function() {
				$('wipeRight').show()
			},
			afterFinish: function() {								
				element.down('img').writeAttribute('src',options.newImg)
				('wipeRight').remove()
			}}
		)
	break;
	case 'toTop':
		element.insert(new Element("div", { id: "wipeRight", style:'display:none;position:absolute;top:'+wipeHeight+'px;left:0px;z-index:10;overflow:hidden;width:'+wipeWidth+'px;height:0px;background-image:url('+options.newImg+');background-position:0px '+wipeHeight+'px;' }))	
		return new Effect.Morph('wipeRight',{
			duration:options.duration,
			style:'top:0px;height:'+wipeHeight+'px;', 
			afterUpdate: function() {
					//work-around to fix fact that effect.morph does not handle background position properly
					$('wipeRight').style.backgroundPosition='0px -'+$('wipeRight').style.top
				},
			beforeStart: function() {
				$('wipeRight').show()
			},
			afterFinish: function() {								
				element.down('img').writeAttribute('src',options.newImg)
				$('wipeRight').remove()
			}}
		)
	break;
	case 'toBottom':
		element.insert(new Element("div", { id: "wipeRight", style:'display:none;position:absolute;top:0px;left:0px;z-index:10;overflow:hidden;width:'+wipeWidth+'px;height:0px;background-image:url('+options.newImg+');background-position:0px 0px;' }))	
		return new Effect.Morph('wipeRight',{
			duration:options.duration,
			style:'top:0px;height:'+wipeHeight+'px;background-position:0px 0px', 
			beforeStart: function() {
				$('wipeRight').show()
			},
			afterFinish: function() {								
				element.down('img').writeAttribute('src',options.newImg)
				$('wipeRight').remove()
			}}
		)
	break;
	case 'flipRight':
		//break the image down into pieces
		var steps = 50
		var vBars=Math.round(wipeWidth/steps)
		var hBars=Math.round(wipeHeight/steps)
		$R(0,steps,true).each(function(x){
			barHeight = hBars
			if(x==steps-1) {
				barHeight = barHeight + wipeHeight - (hBars*steps)
			}
			barLeft = (hBars*x)+(wipeWidth/3)
			element.insert(new Element("div", { id: "wipeBar"+x,'class':'wipeBars_hbars',style:'position:absolute;top:'+hBars*x+'px;left:-'+barLeft+'px;z-index:10;overflow:hidden;width:'+vBars*x+'px;height:'+barHeight+'px;background-image:url('+options.newImg+');background-position:0px -'+hBars*x+'px;' }))	
		})
		//return;
		$R(0,steps,true).each(function(x){
			new Effect.Morph('wipeBar'+x,{queue: { scope: 'wipe' },style:'left:0px;width:'+wipeWidth+'px;background-position:0px 0px'})
		})
		new Effect.Morph('wipeBar'+(steps-1),{queue: { scope: 'wipe' },style:'left:0px;width:'+wipeWidth+'px;background-position:0px 0px',
			afterFinish:function(){
				element.down('img').writeAttribute('src',options.newImg)
				$$('.wipeBars_hbars').invoke('remove')
			}
		})
	break;
	case 'hpanels':
		steps = options.panels
		vBars=Math.round(wipeWidth/steps)
		hBars=Math.round(wipeHeight/steps)
		$R(0,steps,true).each(function(x){
			barHeight = hBars
			if(x==steps-1) {				
				barHeight = barHeight + wipeHeight - (hBars*steps)
			}
			barLeft = Math.round(Math.random()*wipeWidth)
			element.insert(new Element("div", { id: "wipeBar"+x,'class':'wipeBars_hbars', style:'position:absolute;top:'+hBars*x+'px;left:-'+barLeft+'px;z-index:10;overflow:hidden;width:0px;height:'+barHeight+'px;background-image:url('+options.newImg+');background-position:0px -'+hBars*x+'px;' }))	
		});
		//return;
		$R(0,steps,true).each(function(x){
			new Effect.Morph('wipeBar'+x,{style:'left:0px;width:'+wipeWidth+'px;background-position:0px '+wipeWidth+'px'})
		});
		
		new Effect.Morph('wipeBar'+(steps-1),{style:'left:0px;width:'+wipeWidth+'px;background-position:0px '+wipeWidth+'px',
			afterFinish:function(){
				element.down('img').writeAttribute('src',options.newImg)
				$$('.wipeBars_hbars').invoke('remove')
			}
		})

	break;
	case 'vpanels':
		steps = options.panels
		vBars=Math.round(wipeWidth/steps)
		hBars=Math.round(wipeHeight/steps)
		$R(0,steps,true).each(function(x){
			barWidth = vBars
			if(x==steps-1) {				
				barWidth = barWidth + wipeWidth - (vBars*steps)
			}
			barLeft = Math.round(Math.random()*wipeWidth)
			element.insert(new Element("div", { id: "wipeBar"+x,'class':'wipeBars_vbars',style:'position:absolute;left:'+vBars*x+'px;top:-'+barLeft+'px;z-index:10;overflow:hidden;height:0px;width:'+barWidth+'px;background-image:url('+options.newImg+');background-position:-'+vBars*x+'px 0px;' }))	
		});
		//return;
		$R(0,(steps-1),true).each(function(x){
			new Effect.Morph('wipeBar'+x,{style:'top:0px;height:'+wipeHeight+'px;', afterUpdate:function() {					
					element.style.backgroundPosition='background-position:'+wipeHeight+'px 0px'
				}
			})
		});
		
		new Effect.Morph('wipeBar'+(steps-1),{style:'top:0px;height:'+wipeHeight+'px;',
			afterUpdate:function() {
				element.style.backgroundPosition='background-position:'+wipeHeight+'px 0px'	
			},
			afterFinish:function(){
				element.down('img').writeAttribute('src',options.newImg)
				$$('.wipeBars_vbars').invoke('remove')
			}
		})

	break;	
	default:
		//
	}
	
   
};