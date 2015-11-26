function SystemController(){
    'use strict';
    var self = this;

    function init(){
        $(document).on('click', '.planet', clickHandler);

        $('#play_pause').on('click', function(){
            $(this).toggleClass('play pause');
            if($(this).hasClass('play')){
                system.startMovement();
                $('#go_or_select').hide();
            } else  {
                system.stopMovement();
                console.log($('#instructions_container').css('display'));
                if($('#instructions').css('display') != 'block'){
                    $('#go_or_select').show();
                }
            }
        });

        $('#clear').on('click', function(){
            system.clearAll();
            $('#go_or_select').show();
            $('#play_pause').trigger('click');


        });

        document.querySelector('#paths_on_off').addEventListener('click', function(e){
            self.setPaths(e, !system.pathsOn);

        });

        document.querySelector('#follow_on_off').addEventListener('click', function(e){
            if(system.followMode){
                system.followMode = false;
                $(e.target).text('Activate follow mode');
            } else {
                system.followMode = true;
                $(e.target).text('Stop follow mode');
            }
        });

        $('#remove_planet').on('click', function(){
            //$('.planet.active').remove();
            $('#planet_info').find('span').text('');
            $('#remove_planet').toggle();
            remove_planet(planets_array, planets_array[$('.planet.active').index()])
        });

        $('#center_planet').on('click', function(){
            window.scrollTo($('.active').position().left-(window.innerWidth/2), $('.active').position().top-(window.innerHeight/2));

        });

        $('#next_planet').on('click', function(){
            var $next = $('.active').removeClass('active').next();
            if($next.length){
                $next.addClass('active')
            } else {
                $('.planet').first().addClass('active');
            }
            index = $('.planet.active').index();

            self.showPlanetInfo(system.planets[index])
        });

        $('#previous_planet').on('click', function(){
            var $prev = $('.active').removeClass('active').prev();
            if($prev.length){
                $prev.addClass('active')
            } else {
                $('.planet').last().addClass('active');
            }
            index = $('.planet.active').index();
            self.showPlanetInfo(system.planets[index])
        });

        $('#select_system, #select_system_from_go').on('change', function(){

            var id = $(this).val();
            var data_path = $(this).find(':selected').attr('data-path');
            displayPlanets(id);

            $('#instructions').fadeOut();
            $('#play_pause').addClass('pause').removeClass('play');
            $('#go_or_select').show();



        });

        $('#play_from_go').on('click', function(){
            $('#go_or_select').hide();
            $('#play_pause').trigger('click');
        });
    }

    function clickHandler(e){
        $('.active').removeClass('active');
        $(this).addClass('active');
        this.showPlanetInfo(e.target);
    }


    this.showPlanetInfo = function(planet){
        $('#planet_info').find('#info_span').text('mass = '+planet.mass+', volume = '+planet.volume+', speed x = '+Math.round(planet.speed_x)+', speed y = '+Math.round(planet.speed_y)).css('color', planet.color);
        $('#remove_planet, #center_planet').show();

    }

    this.setPaths = function(e,bool){
        console.log(bool)
        if(!bool){
            system.pathsOn = false;
            $('svg').remove();
            $(e.target).text('Activate paths')

        } else {
            system.pathsOn = true;
            system.clearPaper();
            $(e.target).text('Hide paths');
        }			

    }

    function getJsonData(id){
        $.get("systems/"+id, function(data, status){
            system.clearAll();
            var planetsInSystem = JSON.parse(data);
            system.populateSystemFromObject(planetsInSystem);


        })

    } 

    function displayPlanets(id){
     system.clearAll();
     console.log(id);
            var planetsInSystem = systemsObjects[id-1];
            console.log(planetsInSystem)
            system.populateSystemFromObject(planetsInSystem);
    }
    init();
}
