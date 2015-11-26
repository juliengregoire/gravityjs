function PlanetBuilder(options){
    'use strict';
    var defaults = {
        mass: 1,
        speed: 0,
        direction: 0,
        volume: 15,
        acc: 0,
        color: '#66f',
    }
    Object.assign(defaults, options)
    var builtPlanet = $('#planet');
    
    $('#slider_volume').slider({
        value: defaults.volume,
        slide: function(event, ui){
            builtPlanet.css({'width': ui.value+'px', 'height': ui.value+'px'});
            defaults.volume = ui.value;
            $(this).prev().text('Volume = '+ defaults.volume);
        }
    }).prev().text('Volume = '+defaults.volume);
    $('#slider_mass').slider({
        max: 30000,
        min: 1,	
        slide: function(event, ui){
            defaults.mass = ui.value;
            $(this).prev().text('Mass = '+ defaults.mass);
        }
    });
    $('#slider_speed').slider({
        max: 20,
        min: 0,
        slide: function(event, ui){
            defaults.speed = ui.value;
            $(this).prev().text('Speed = '+ defaults.speed);

        }
    });
    $('#slider_direction').rotatable({
        rotate: function(event,ui){
            defaults.direction = ui.angle.current*180/Math.PI;

        }
    });
    $('#custom').spectrum({
    
        color: defaults.color,
        clickoutFiresChange: true,
        change: function(color){
            builtPlanet.css({'background': 'linear-gradient(to bottom right, #555,'+ defaults.color+')'});
            
            }
    });

    builtPlanet.draggable({
        stack: '#planet',
        helper: 'clone',
        appendTo: $('#space'),
        containment: $('#space'),
        start: function(event, ui){
            $('#instructions_container' ).hide();
            $('#go_or_select').show();		
            ui.helper.css({'background': $(this).css('background'), 'position':'absolute', 'border-radius':'100%', 'margin':'-'+ui.helper.width()/2+'px 0 0 -'+ui.helper.height()/2+'px', 'z-index':'1000000'})
            $('body').css('cursor', 'none');	
        },
        stop: function(event, ui){
            $('body').css('cursor', 'default');
        }	
})
$('#space').droppable({
    drop: function(event, ui){
        if(!ui.draggable.hasClass('planet')){		
            var droppedPlanet = new Planet(defaults);
            system.planets.push(droppedPlanet);
            $(this).append(droppedPlanet.planetObj.css({'background': ui.draggable.css('background'), 'top': ui.position.top, 'left': ui.position.left}));
            $('.active').removeClass('active');
            $('.planet').last().addClass('active');
            var index = $('.planet.active').index()-1;						
            controller.showPlanetInfo(droppedPlanet);
            if(!system.isMoving && $('#play_pause').hasClass('play')){
                system.startMovement();
            }
            system.isMoving = true;
        }	
    }
});
}
